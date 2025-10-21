import { AIMode, Chat } from "@/types";
import {
  IconRobotFace,
  IconPlus,
  IconCode,
  IconPaint,
  IconHeartFilled,
} from "@tabler/icons-react";
import clsx from "clsx";
import Button from "@/components/ui/Button";

type SidebarProps = {
  width?: string;
  className?: string;
  isOpen?: boolean;
};

const aiModes: AIMode[] = [
  {
    title: "Friendly",
    subtitle: "Warm and conversational",
    icon: IconHeartFilled,
  },
  { title: "Technical", subtitle: "Precise and detailed", icon: IconCode },
  { title: "Creative", subtitle: "Imaginative and inspiring", icon: IconPaint },
];

const chats: Chat[] = [
  { title: "How to build a react app?", relativeTime: "2 hours ago" },
  { title: "Creative writing prompts", relativeTime: "Yesterday" },
  { title: "API documentation best practices", relativeTime: "3 days ago" },
  { title: "Marketing strategy ideas", relativeTime: "1 week ago" },
  { title: "UI design principles", relativeTime: "2 weeks ago" },
];

export default function Sidebar({
  width = "w-64",
  className,
  isOpen,
}: SidebarProps) {
  return (
    <aside
  className={clsx(
    "flex flex-col h-screen border-r border-gray-200 transition-transform duration-300 bg-white p-8 space-y-8 overflow-hidden shadow-md md:shadow-none",
    width,
    !isOpen && "-translate-x-full md:translate-x-0",
    className
  )}
>

      <div className="flex space-x-2 items-center">
        <div className="w-10 h-10 text-white grid place-items-center rounded-lg bg-primary">
          <IconRobotFace />
        </div>
        <h1 className="text-lg font-semibold font-(family-name:--font-robot-text)">
          PromptPilot
        </h1>
      </div>

      <Button variant="primary">
        <IconPlus />
        <span>New Chat</span>
      </Button>

      <hr />

      <nav className="space-y-2 mt-4">
        <h3 className="font-(family-name:--font-robot-text)">AI Modes</h3>
        <ul className="space-y-3 text-sm">
          {aiModes.map((aiMode, index) => {
            const Icon = aiMode.icon;

            return (
              <li
                key={index}
                className="space-y-1 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex space-x-2 items-center text-gray-800">
                  {Icon && <Icon size="20" stroke={1.8} />}
                  <b>{aiMode.title}</b>
                </div>
                <p className="text-gray-500">{aiMode.subtitle}</p>
              </li>
            );
          })}
        </ul>
      </nav>

      <hr />

      <section className="flex-1 mt-4 space-y-2">
        <h3 className="font-(family-name:--font-robot-text)">Recent Chats</h3>

        <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
          {chats.map((chat, index) => (
            <a
              key={index}
              className="flex flex-col space-y-1 p-2 rounded hover:bg-gray-50 cursor-pointer"
            >
              <em className="text-sm text-gray-800">{chat.title}</em>
              <small className="text-gray-500">{chat.relativeTime}</small>
            </a>
          ))}
        </div>
      </section>
    </aside>
  );
}
