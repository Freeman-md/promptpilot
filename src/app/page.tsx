"use client";

import { AnimatePresence, motion } from "motion/react";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageForm from "@/components/chat/MessageForm";
import { useChatStore } from "@/store/chatStore";
import { IconRobotFace } from "@tabler/icons-react";

export default function Home() {
  const { messages } = useChatStore();
  const hasMessages = Array.isArray(messages) && messages.length > 0;

  return (
    <div className="relative flex h-full w-full flex-col bg-white">
      <div className="relative flex-1 overflow-hidden">
        {!hasMessages && (
          <div className="absolute inset-0 grid place-items-center px-6">
            <div className="max-w-xl text-center">
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

        <div className="absolute inset-0 flex flex-col overflow-y-auto px-6 pb-24 pt-10">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="mb-4 last:mb-0"
              >
                <MessageBubble
                  sender={message.role === "user" ? "user" : "ai"}
                  text={message.content}
                  isStreaming={message.isStreaming}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <MessageForm />
      </div>
    </div>
  );
}
