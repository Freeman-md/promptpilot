import { IconRobotFace, IconUser, IconUserCircle } from "@tabler/icons-react";

type MessageBubbleProps = {
  sender: "ai" | "user";
  text: string;
};

export default function MessageBubble({ sender, text }: MessageBubbleProps) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex items-start gap-2 max-w-lg ${
        isUser ? "ml-auto flex-row-reverse" : ""
      }`}
    >
      <div
        className={`grid h-8 w-8 place-items-center rounded-full shrink-0 ${
          isUser ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        {isUser ? <span><IconUserCircle /></span> : <IconRobotFace size={18} />}
      </div>

      <div
        className={`rounded-xl border px-3 py-2 text-sm ${
          isUser
            ? "bg-primary text-white border-transparent"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
