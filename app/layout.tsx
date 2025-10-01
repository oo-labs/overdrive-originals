import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Overdrive Originals",
  description: "A content studio by Esse Werks: Race Support, Second Chance Customs, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}>
        {/* Background video */}
        <div className="fixed inset-0 -z-20 overflow-hidden">
          <video className="h-full w-full object-cover" autoPlay loop muted playsInline poster="/bg-poster.jpg">
            <source src="/bg.webm" type="video/webm" />
            <source src="/bg.mp4" type="video/mp4" />
          </video>
          {/* Animated gradient fallback overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        </div>

        {/* Floating brand logo */}
        <header className="fixed top-0 left-0 right-0 z-10">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex justify-center">
              <Link href="/" className="inline-flex items-center gap-4 text-white hover:opacity-80 transition-opacity">
                <Image src="/oo.svg" alt="Overdrive Originals" width={64} height={64} />
                <span className="text-2xl font-bold tracking-wide">Overdrive Originals</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content with spacing for header */}
        <div className="pt-24">{children}</div>

        {/* Footer */}
        <footer className="relative z-10 mt-24">
          <div className="mx-auto max-w-6xl px-4 pb-10">
            <div className="text-center text-white/70 text-sm leading-relaxed">
              © {new Date().getFullYear()} Overdrive Originals by Esse Werks. All rights reserved.
              <br />
              This site participates in community-driven projects. All product names, logos, and brands are property of their respective owners.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
