import {
  IconRobotFace,
  IconPlus,
  IconCode,
  IconPaint,
  IconHeartFilled,
} from "@tabler/icons-react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import { useLayoutStore } from "@/store/layoutStore";
import { useChatStore } from "@/store/chatStore";
import { useState, useEffect } from "react";

type SidebarProps = {
  width?: string;
  className?: string;
};

const modeIcons: Record<string, React.ElementType> = {
  Friendly: IconHeartFilled,
  Technical: IconCode,
  Creative: IconPaint,
};

export default function Sidebar({ width = "w-64", className }: SidebarProps) {
  const { sidebarOpen: isOpen } = useLayoutStore();

  const {
    aiModes,
    activeAIMode,
    setActiveAIMode,
    getAllChats,
    createNewChat,
    currentChatId,
  } = useChatStore();

  const [chats, setChats] = useState(() => getAllChats());

  useEffect(() => {
    setChats(getAllChats());
  }, [currentChatId, getAllChats]);

  return (
    <aside
      className={clsx(
        "flex flex-col h-screen border-r border-gray-200 transition-transform duration-300 bg-white p-8 space-y-8 overflow-hidden shadow-md md:shadow-none",
        width,
        !isOpen && "-translate-x-full md:translate-x-0",
        className
      )}
    >
      {/* ─── Header ─────────────────────────────── */}
      <div className="flex space-x-2 items-center">
        <div className="w-10 h-10 text-white grid place-items-center rounded-lg bg-primary">
          <IconRobotFace />
        </div>
        <h1 className="text-lg font-semibold font-(family-name:--font-robot-text)">
          PromptPilot
        </h1>
      </div>

      {/* ─── New Chat Button ───────────────────── */}
      <Button
        variant="primary"
        onClick={() => {
          try {
            createNewChat();
            setChats(getAllChats());
          } catch (err) {
            if (err instanceof Error) alert(err.message);
          }
        }}
      >
        <IconPlus />
        <span>New Chat</span>
      </Button>

      <hr />

      <nav className="space-y-2 mt-4">
        <h3 className="font-(family-name:--font-robot-text)">AI Modes</h3>

        <ul className="space-y-2 text-sm">
          {aiModes.map((mode) => {
            const Icon = modeIcons[mode.title] || IconHeartFilled;
            const isActive = activeAIMode.title === mode.title;

            return (
              <li
                key={mode.title}
                onClick={() => setActiveAIMode(mode.title)}
                className={clsx(
                  "p-3 rounded-lg cursor-pointer transition-colors duration-150",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "hover:bg-gray-50 text-gray-800"
                )}
              >
                <div className="flex items-center space-x-2">
                  <Icon
                    size={20}
                    stroke={1.8}
                    className={clsx(isActive ? "text-white" : "text-gray-700")}
                  />
                  <b>{mode.title}</b>
                </div>
                {mode.subtitle && (
                  <p
                    className={clsx(
                      "text-xs mt-1",
                      isActive ? "text-white/80" : "text-gray-500"
                    )}
                  >
                    {mode.subtitle}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <hr />

      <section className="flex-1 mt-4 space-y-2">
        <h3 className="font-(family-name:--font-robot-text)">Recent Chats</h3>

        {chats.length === 0 ? (
          <p className="text-sm text-gray-500 mt-2">No chats yet</p>
        ) : (
          <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
            {chats.map((chat) => (
              <a
                key={chat.id}
                onClick={() => {
                  localStorage.setItem("currentChatId", chat.id);
                  window.location.reload(); // simple for demo
                }}
                className={clsx(
                  "flex flex-col space-y-1 p-2 rounded cursor-pointer transition",
                  chat.id === currentChatId
                    ? "bg-gray-100 border border-gray-200"
                    : "hover:bg-gray-50"
                )}
              >
                <em className="text-sm text-gray-800 truncate">
                  {chat.title || "Untitled Chat"}
                </em>
                <small className="text-gray-500">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </small>
              </a>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}
