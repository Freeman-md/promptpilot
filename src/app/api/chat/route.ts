import { AIMode, Message } from "@/types";
import { openai } from "@/lib/openai";
import { ResponseInput } from "openai/resources/responses/responses.mjs";

function validateUserInput(text: string): Response | null {
    if (!text || text.trim().length === 0) {
        return new Response("Empty messages are not allowed.", { status: 400 });
    }

    if (text.length > 1000) {
        return new Response("Message too long. Limit to 1000 characters.", { status: 413 });
    }

    const injectionPatterns = [/ignore previous/i, /system prompt/i];
    if (injectionPatterns.some((pattern) => pattern.test(text))) {
        return new Response("Unsafe input detected. Please remove restricted phrases.", {
            status: 400,
        });
    }

    return null;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { message, mode, history } = body as {
            message: Message;
            mode: AIMode;
            history?: Message[];
        };

        if (!message || !mode) {
            return new Response("Missing required fields.", { status: 400 });
        }

        const inputValidationError = validateUserInput(message.content);
        if (inputValidationError) return inputValidationError;

        const inputModeration = await openai.moderations.create({
            model: "omni-moderation-latest",
            input: message.content,
        });

        if (inputModeration.results[0].flagged) {
            return new Response("Your message contains disallowed or unsafe content.", {
                status: 400,
            });
        }

        const systemPromptMap: Record<string, string> = {
            Friendly: "Be kind and conversational. Reply in 1–3 short sentences.",
            Technical: "Be clear and concise. Reply in 1–3 short paragraphs max.",
            Creative: "Be imaginative but brief. Reply in under 4 sentences.",
        };

        const systemPrompt = systemPromptMap[mode.title] || systemPromptMap["Friendly"];

        const recentHistory = (history || []).slice(-10);

        const messages = [
            {
                role: "developer",
                content: [{ type: "input_text", text: systemPrompt }],
            },
            ...recentHistory.map((msg) => ({
                role: msg.role,
                content: [
                    {
                        type: msg.role === "assistant" ? "output_text" : "input_text",
                        text: msg.content,
                    },
                ],
            })),
            {
                role: "user",
                content: [{ type: "input_text", text: message.content }],
            },
        ] as ResponseInput;

        const response = await openai.responses.create({
            model: "gpt-5-mini",
            input: messages,
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder()

                try {
                    for await (const event of response) {
                        if (
                            event.type === "response.output_text.delta" ||
                            event.type === "response.refusal.delta"
                        ) {
                            controller.enqueue(encoder.encode(event.delta))
                        } else if (event.type === 'response.completed') {
                            const usage = event.response.usage

                            console.log(usage)

                            if (usage) {
                                const summary = JSON.stringify({
                                    type: "usage",
                                    usage
                                })

                                controller.enqueue(encoder.encode(`\n${summary}\n`));
                            }

                            controller.close()
                        }
                    }
                } catch (error) {
                    controller.error(error)
                }
            }
        })

        console.log(stream)

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            },
        });
    } catch (err) {
        console.error("Error parsing body:", err);
        return new Response("Invalid request body", { status: 400 });
    }
}