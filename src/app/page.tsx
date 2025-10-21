import MessageBubble from "@/components/chat/MessageBubble";
import { IconRobotFace, IconSend } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="relative h-full w-full flex flex-col bg-white">
      <div className="flex-1 relative overflow-y-auto">
        <div className="absolute inset-0 grid place-items-center px-6">
          <div className="text-center max-w-xl">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary text-white">
              <IconRobotFace size={28} />
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold font-(family-name:--font-robot-text)">
              Welcome to PromptPilot
            </h1>
            <p className="mt-2 text-gray-600">
              Start a conversation with your AI assistant. Choose a mode and ask anything.
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4">
          <MessageBubble
            sender="ai"
            text="Of course! I’d be happy to help with your coding question. What topic?"
          />
          <MessageBubble
            sender="user"
            text="Hello! Can you help me with a coding question?"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        <form className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message here..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-primaring-primary text-white hover:opacity-90 transition"
          >
            <IconSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
