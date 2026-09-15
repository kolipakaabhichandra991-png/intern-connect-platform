import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    template: '%s | Belvo',
    default: 'Belvo | Intern Connect Platform',
  },
  description: 'Elevate your career with AI-driven insights, gamified progress, and seamless team collaboration.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'VT323', monospace" }}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
