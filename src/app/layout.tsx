import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-robot-text", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PromptPilot",
  description: "Created By Freeman",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${spaceGrotesk.variable} antialiased flex`}>
        <Sidebar width="w-1/4" />

        <div className="flex-1 min-h-screen flex flex-col bg-white">
          <Header mode="Friendly Mode" />
          <main className="relative flex-1 min-h-0">
            { children }
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
