import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackgroundVideo from "./components/BackgroundVideo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Overdrive Originals - Independent Automotive Content Studio",
  description: "Overdrive Originals is an independent automotive content studio featuring Race Support builds, Second Chance Customs, automotive merchandise, and premium automotive content. Discover cutting-edge automotive projects, custom builds, and exclusive automotive content.",
  keywords: [
    "automotive content",
    "race support",
    "second chance customs", 
    "automotive builds",
    "custom cars",
    "automotive merchandise",
    "car builds",
    "automotive projects",
    "racing content",
    "automotive studio",
    "car customization",
    "automotive media",
    "overdrive originals",
    "esse werks",
    "automotive entertainment"
  ],
  authors: [{ name: "Overdrive Originals" }],
  creator: "Overdrive Originals",
  publisher: "Overdrive Originals",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Overdrive Originals - Independent Automotive Content Studio",
    description: "Discover cutting-edge automotive projects, custom builds, and exclusive automotive content from Overdrive Originals.",
    url: "https://overdriveoriginals.com",
    siteName: "Overdrive Originals",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Overdrive Originals Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Overdrive Originals - Independent Automotive Content Studio",
    description: "Discover cutting-edge automotive projects, custom builds, and exclusive automotive content.",
    images: ["/android-chrome-512x512.png"],
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  alternates: {
    canonical: "https://overdriveoriginals.com",
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const videoDuration = parseFloat(process.env.NEXT_PUBLIC_BG_VIDEO_DURATION || "6.0");
  const crossfadeDuration = parseFloat(process.env.NEXT_PUBLIC_BG_CROSSFADE_DURATION || "1.3");

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Overdrive Originals",
              "description": "An independent automotive content studio featuring Race Support builds, Second Chance Customs, automotive merchandise, and premium automotive content.",
              "url": "https://overdriveoriginals.com",
              "logo": "https://overdriveoriginals.com/android-chrome-512x512.png",
              "sameAs": [
                "https://youtube.com/@overdriveoriginals",
                "https://instagram.com/overdriveoriginals"
              ],
              "foundingDate": "2024",
              "industry": "Automotive Content Production",
              "keywords": [
                "automotive content",
                "race support",
                "second chance customs",
                "automotive builds",
                "custom cars",
                "automotive merchandise"
              ],
              "offers": {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Automotive Content Production",
                  "description": "Premium automotive content, custom builds, and automotive merchandise"
                }
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}>
        {/* Background video */}
        <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1000 }}>
          <BackgroundVideo videoDuration={videoDuration} crossfadeDuration={crossfadeDuration} />
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
          <div className="flex-1 flex items-center justify-center pt-24 pb-24 sm:pt-32 sm:pb-32">
            {children}
          </div>
        </div>

        {/* Footer - viewport bottom */}
        <footer className="fixed bottom-4 sm:bottom-8 left-0 right-0 z-10">
          <div className="text-center text-white/70 text-xs sm:text-sm leading-relaxed px-4">
            © {new Date().getFullYear()} Overdrive Originals. All rights reserved.
            <br />
            This site participates in community-driven projects. All product names, logos, and brands are property of their respective owners.
          </div>
        </footer>
      </body>
    </html>
  );
}
