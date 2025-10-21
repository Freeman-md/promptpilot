import { IconRobotFace } from "@tabler/icons-react";

export default function MainEmpty() {
  return (
    <div className="relative h-full w-full">
      {/* Center content */}
      <div className="absolute inset-0 grid place-items-center px-6">
        <div className="text-center max-w-xl">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-primary)] text-white">
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

      <div className="absolute left-6 bottom-6 max-w-sm">
        <div className="flex items-start gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-gray-200 text-gray-700">
            <IconRobotFace size={18} />
          </div>
          <div className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm">
            Of course! I’d be happy to help with your coding question. What topic?
          </div>
        </div>
      </div>
    </div>
  );
}
