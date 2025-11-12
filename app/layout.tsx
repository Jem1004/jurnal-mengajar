import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: {
    default: "Jurnal Mengajar",
    template: "%s | Jurnal Mengajar"
  },
  description: "Aplikasi digital modern untuk jurnal mengajar dan monitoring pembelajaran",
  keywords: ["jurnal mengajar", "pendidikan", "monitoring pembelajaran", "digital"],
  authors: [{ name: "Education Team" }],
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-secondary text-primary antialiased`}>
        <SessionProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-white">
              {children}
            </div>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
