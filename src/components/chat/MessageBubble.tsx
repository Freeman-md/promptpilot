import { IconRobotFace, IconUserCircle } from "@tabler/icons-react";

type MessageBubbleProps = {
  sender: "ai" | "user";
  text: string;
  isStreaming?: boolean;
};

export default function MessageBubble({ sender, text, isStreaming }: MessageBubbleProps) {
  const isUser = sender === "user";
  const showTypingIndicator = !isUser && isStreaming && text.length === 0;

  return (
    <div
      className={`flex items-start gap-2 max-w-lg ${
        isUser ? "ml-auto flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`grid h-8 w-8 place-items-center rounded-full shrink-0 ${
          isUser ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        {isUser ? <IconUserCircle size={18} /> : <IconRobotFace size={18} />}
      </div>

      {/* Message bubble */}
      <div
        className={`rounded-xl border px-3 py-2 text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-white border-transparent"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        {showTypingIndicator ? (
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: `${index * 120}ms` }}
              />
            ))}
          </div>
        ) : (
          <>
            {text}
            {isStreaming && !isUser && text.length > 0 && (
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse ml-1" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
