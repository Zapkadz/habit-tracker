import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker - Routine Balance Dashboard",
  description:
    "A local-first dashboard for daily routine planning, habit tracking, and burnout-aware balance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full max-w-full overflow-x-clip antialiased`}
    >
      <body className="min-h-full max-w-full overflow-x-clip bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
