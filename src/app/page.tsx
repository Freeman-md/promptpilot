"use client";

import MessageBubble from "@/components/chat/MessageBubble";
import { useChatStore } from "@/store/chatStore";
import { IconRobotFace, IconSend } from "@tabler/icons-react";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isAwaitingAIResponse } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || text.length <= 3 || isAwaitingAIResponse) return;

    setInput("");

    await sendMessage(text);
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-white">
      <div className="flex-1 relative overflow-y-auto">
        {(!messages || (Array.isArray(messages) && messages.length === 0)) && (
          <div className="absolute inset-0 grid place-items-center px-6">
            <div className="text-center max-w-xl">
              <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-white">
                <IconRobotFace size={28} />
              </div>

              <h1 className="text-2xl md:text-3xl font-semibold font-(family-name:--font-robot-text)">
                Welcome to PromptPilot
              </h1>
              <p className="mt-2 text-gray-600">
                Start a conversation with your AI assistant. Choose a mode and
                ask anything.
              </p>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              sender={message.role === "user" ? "user" : "ai"}
              text={message.content}
              isStreaming={message.isStreaming}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message here..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-primary ring-primary text-white hover:opacity-90 transition disabled:opacity-10"
            disabled={isAwaitingAIResponse}
          >
            <IconSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
