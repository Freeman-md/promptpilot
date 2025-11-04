import { useChatStore } from "@/store/chatStore";
import { useLayoutStore } from "@/store/layoutStore";
import { IconMenu2 } from "@tabler/icons-react";
import Button from "../ui/Button";

export default function Header() {
  const { toggleSidebar } = useLayoutStore();
  const { activeAIMode, tokensUsed } = useChatStore();

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-white sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open sidebar"
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 md:hidden"
        >
          <IconMenu2 size={20} />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-gray-800 font-medium">
            AI Assistant · {activeAIMode.title} mode
          </span>
        </div>
      </div>

      <div className="flex space-x-2 items-center">
        <div className="relative">Tokens Used: {tokensUsed}</div>

        <Button
          variant="muted"
          onClick={() => {
            useChatStore.getState().resetTokenCount();
            localStorage.removeItem("tokensUsed");
          }}
        >
          Reset Tokens
        </Button>
      </div>
    </header>
  );
}
