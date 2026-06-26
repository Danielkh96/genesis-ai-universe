import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Genesis AI Universe | AI Coding, Agents, Automation & Marketing",
  description:
    "An interactive 3D AI learning universe for AI Coding, AI Agents, AI Automation and AI Marketing.",
  keywords: ["AI Course", "AI Coding", "AI Agent", "AI Automation", "AI Marketing", "Genesis AI Universe"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#02030a] text-white">{children}</body>
    </html>
  );
}
