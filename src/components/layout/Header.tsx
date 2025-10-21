import { useLayoutStore } from "@/store/layoutStore";
import { IconDotsVertical, IconMenu2 } from "@tabler/icons-react";

export default function Header({ mode = "Friendly Mode" }: { mode?: string }) {
    const { toggleSidebar } = useLayoutStore();

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
          <span className="text-gray-800 font-medium">AI Assistant · {mode}</span>
        </div>
      </div>

      <div className="relative">
        <button
          aria-label="More"
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
        >
          <IconDotsVertical size={18} />
        </button>

        <div className="hidden absolute right-0 mt-2 w-40 rounded-md border bg-white shadow">
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
            Settings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
            About
          </button>
        </div>
      </div>
    </header>
  );
}
