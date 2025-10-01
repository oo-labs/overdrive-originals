import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import DimmedBackgroundVideo from "../components/DimmedBackgroundVideo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Merch - Overdrive Originals",
  description: "Official Overdrive Originals merchandise and apparel.",
};

export default function MerchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const crossfadeDuration = parseFloat(process.env.NEXT_PUBLIC_BG_CROSSFADE_DURATION || "1.3");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}>
        {/* Dimmed background video */}
        <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1000 }}>
          <DimmedBackgroundVideo crossfadeDuration={crossfadeDuration} />
        </div>

        {/* Floating brand logo - viewport top */}
        <header className="fixed top-8 left-0 right-0 z-10">
          <div className="flex justify-center">
            <Link href="/" className="text-white hover:opacity-80 transition-opacity p-8 block">
              <Image src="/oo.svg" alt="Overdrive Originals" width={192} height={192} />
            </Link>
          </div>
        </header>

        {/* Page content - full viewport height */}
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center pt-32 pb-32">
            {children}
          </div>
        </div>

        {/* Footer - viewport bottom */}
        <footer className="fixed bottom-8 left-0 right-0 z-10">
          <div className="text-center text-white/70 text-sm leading-relaxed px-4">
            © {new Date().getFullYear()} Overdrive Originals. All rights reserved.
            <br />
            This site participates in community-driven projects. All product names, logos, and brands are property of their respective owners.
          </div>
        </footer>
      </body>
    </html>
  );
}
