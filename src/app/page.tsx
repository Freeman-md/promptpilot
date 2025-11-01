"use client";

import MessageBubble from "@/components/chat/MessageBubble";
import MessageForm from "@/components/chat/MessageForm";
import { useChatStore } from "@/store/chatStore";
import { IconRobotFace } from "@tabler/icons-react";

export default function Home() {
  const { messages } = useChatStore();

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

        <div className="absolute bottom-2 left-6 right-6 flex flex-col gap-4 overflow-y-scroll h-full pt-10">
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
        <MessageForm />
      </div>
    </div>
  );
}
