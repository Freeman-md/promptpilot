"use client";

import { useChatStore } from "@/store/chatStore";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MessageForm() {
  const [input, setInput] = useState("");
  const { sendMessage, isAwaitingAIResponse } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const text = input.trim();

    // Input Guardrails below - Total (5)

    if (!text) {
      toast.warning("Please enter a message before sending.", {
        position: "top-right",
      });
      return;
    }

    if (text.length <= 3) {
      toast.warning("Message too short — try adding a bit more context.", {
        position: "top-right",
      });
      return;
    }

    if (text.length > 1000) {
      toast.error(
        "Your message is too long. Please keep it under 1000 characters.",
        {
          position: "top-right",
        }
      );
      return;
    }

    const injectionPatterns = [/ignore previous/i, /system prompt/i];
    if (injectionPatterns.some((pattern) => pattern.test(text))) {
      toast.error("Unsafe input detected. Please remove restricted phrases.", {
        position: "top-right",
      });
      return;
    }

    if (isAwaitingAIResponse) {
      toast.info("Please wait — AI is still responding.", {
        position: "top-right",
      });
      return;
    }

    setInput("");

    try {
      await sendMessage(text);
    } catch (err: unknown) {
      if (err instanceof Error)
        toast.error(err.message, { position: "top-right" });
    }
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
