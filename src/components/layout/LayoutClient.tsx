"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLayoutStore } from "@/store/layoutStore";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen, closeSidebar } = useLayoutStore();

  return (
    <>
      <Sidebar
        width="w-72 sm:w-1/3 lg:w-1/4"
        className="fixed inset-y-0 left-0 z-30 md:static md:translate-x-0"
      />

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/30 md:hidden z-20"
        />
      )}

      <div className="flex-1 min-h-screen flex flex-col bg-white">
        <Header mode="Friendly Mode" />
        <main className="relative flex-1 min-h-0">{children}</main>
        <Footer />
      </div>
    </>
  );
}
