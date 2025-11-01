import { AIMode, Message } from "@/types";
import { openai } from "@/lib/openai";
import { ResponseInput } from "openai/resources/responses/responses.mjs";

export async function POST(request: Request) {
    try {
        const body = await request.json()
        debugger

        console.log('body', body)

        const { message, mode, history } = body as {
            message: Message;
            mode: AIMode;
            history?: Message[];
        };

        if (!message || !mode) {
            return new Response("Missing required fields", {
                status: 400
            })
        }

        const recentHistory = (history || []).slice(-10)

        const systemPromptMap: Record<string, string> = {
            Friendly:"You are a warm, conversational assistant. Respond casually and empathetically. Limit answers to 300 characters max.",
            Technical: "You are a precise, technical assistant. Respond with accurate and detailed answers.",
            Creative: "You are a creative assistant. Respond imaginatively and inspirationally.",
        }

        const systemPrompt = systemPromptMap[mode.title] || systemPromptMap["Friendly"]

        const messages = [
            {
                role: "developer",
                content: [
                    {
                        "type": "input_text",
                        "text": systemPrompt
                    }
                ],
            },
            ...recentHistory.map((message: Message) => ({
                role: message.role,
                content: [
                    {
                        "type": message.role === 'assistant' ? "output_text" : "input_text",
                        "text": message.content
                    }
                ],
            })),
            {
                role: "user",
                content: [
                    {
                        "type": "input_text",
                        "text": message.content
                    }
                ],
            }
        ] as ResponseInput

        const response = await openai.responses.create({
            model: 'gpt-5-mini',
            input: messages,
            stream: true,
        })

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder()

                try {
                    for await (const event of response) {
                          if (event.type === "response.output_text.delta" || event.type === "response.refusal.delta") {
                            console.log("One response", event.delta)
                            controller.enqueue(encoder.encode(event.delta))
                        } else if (event.type === 'response.completed') {
                            controller.close()
                        }
                    }
                } catch (error) {
                    controller.error(error)
                }
            }
        })
        
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