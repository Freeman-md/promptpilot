"use client";

import { useChatStore } from "@/store/chatStore";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";

export default function MessageForm() {
  const [input, setInput] = useState("");

  const { sendMessage, isAwaitingAIResponse } = useChatStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || text.length <= 3 || isAwaitingAIResponse) return;

    setInput("");

    await sendMessage(text);
  };

  return (
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
  );
}
