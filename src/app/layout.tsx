import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-robot-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptPilot",
  description: "Created By Freeman",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${spaceGrotesk.variable} antialiased flex`}
      >
        <Sidebar
          width="w-64 sm:w-1/3 lg:w-1/4"
          className="fixed inset-y-0 left-0 z-30 md:static md:translate-x-0"
          isOpen={false}
        />

          {/* <div className="fixed inset-0 bg-black/30 md:hidden"></div> */}

        <div className="flex-1 min-h-screen flex flex-col bg-white">
          <Header mode="Friendly Mode" />
          <main className="relative flex-1 min-h-0">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
