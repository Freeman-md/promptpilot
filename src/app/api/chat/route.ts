import { AIMode, Message } from "@/types";

export async function POST(request: Request) {
    try {
        const body = await request.json()
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
            Friendly: "You are a warm, conversational assistant. Respond casually and empathetically.",
            Technical: "You are a precise, technical assistant. Respond with accurate and detailed answers.",
            Creative: "You are a creative assistant. Respond imaginatively and inspirationally.",
        }

        const systemPrompt = systemPromptMap[mode.title] || systemPromptMap["Friendly"]

        const messages = [
            {
                role: "system",
                content: systemPrompt,
            },
            ...recentHistory.map((message: Message) => ({
                role: message.role,
                content: message.content
            })),
            {
                role: "user",
                content: message,
            }
        ]

        console.log("🧠 Prepared messages:", messages.length);

        return new Response(JSON.stringify({ ok: true, messages }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Error parsing body:", err);
        return new Response("Invalid request body", { status: 400 });
    }
}