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
        {/* ASCII Art Easter Egg for Developers */}
        {typeof window === 'undefined' && (
          <>
            {`
<!--
╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                   ║
║   ██████╗ ██╗   ██╗███████╗██████╗ ██████╗ ██████╗ ██╗██╗   ██╗███████╗                         ║
║  ██╔═══██╗██║   ██║██╔════╝██╔══██╗██╔══██╗██╔══██╗██║██║   ██║██╔════╝                         ║
║  ██║   ██║██║   ██║█████╗  ██████╔╝██║  ██║██████╔╝██║██║   ██║█████╗                           ║
║  ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗██║  ██║██╔══██╗██║╚██╗ ██╔╝██╔══╝                           ║
║  ╚██████╔╝ ╚████╔╝ ███████╗██║  ██║██████╔╝██║  ██║██║ ╚████╔╝ ███████╗                         ║
║   ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚══════╝                         ║
║                                                                                                   ║
║   ██████╗ ██████╗ ██╗ ██████╗ ██╗███╗   ██╗ █████╗ ██╗     ███████╗                            ║
║  ██╔═══██╗██╔══██╗██║██╔════╝ ██║████╗  ██║██╔══██╗██║     ██╔════╝                            ║
║  ██║   ██║██████╔╝██║██║  ███╗██║██╔██╗ ██║███████║██║     ███████╗                            ║
║  ██║   ██║██╔══██╗██║██║   ██║██║██║╚██╗██║██╔══██║██║     ╚════██║                            ║
║  ╚██████╔╝██║  ██║██║╚██████╔╝██║██║ ╚████║██║  ██║███████╗███████║                            ║
║   ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚══════╝                            ║
║                                                                                                   ║
║                              🎬  FOUND THE EASTER EGG!  📱                                       ║
║                                                                                                   ║
║  Hey there, curious developer! 👋                                                                ║
║                                                                                                   ║
║  You found this because you are the kind of person who digs into the source code,               ║
║  and that is exactly the type of curiosity we love at Overdrive Originals!                      ║
║                                                                                                   ║
║  We are an independent content studio where technology meets storytelling and automotive         ║
║  passion. Are you someone who gets excited about the intersection of code and creativity?       ║
║                                                                                                   ║
║  🎯 TWO PATHS FOR PASSIONATE DEVELOPERS:                                                          ║
║                                                                                                   ║
║  📺 TECH + STORYTELLING (Content Creators)                                                       ║
║     • Digital content platforms and streaming technology                                          ║
║     • Video production tools and workflow automation                                              ║
║     • Content management systems and audience analytics                                           ║
║     • Creative tools that help tell compelling automotive stories                                 ║
║     📧 Email: easteregg@overdriveoriginals.com                                                   ║
║                                                                                                   ║
║  🏎️ TECH + MOTORSPORTS (Performance Aftermarket)                                                 ║
║     • High-performance automotive engineering and tuning                                          ║
║     • Racing data acquisition and telemetry systems                                               ║
║     • Custom ECU programming and engine management                                                ║
║     • The intersection of code, horsepower, and precision engineering                             ║
║     📧 Email: easteregg@essewerks.com                                                            ║
║                                                                                                   ║
║  🎬 TELL US YOUR STORY:                                                                           ║
║  1. Which path excites you more - storytelling or motorsports?                                   ║
║  2. How do you blend technology with your passion?                                                ║
║  3. What is your automotive story? (Dream build? Track days? Content creation?)                 ║
║  4. How did you discover this easter egg? (View Source? DevTools? Pure curiosity?)              ║
║                                                                                                   ║
║  Whether you are a developer, engineer, designer, content creator, or just someone who          ║
║  gets excited about the perfect merge of technology and automotive culture,                      ║
║  we would love to hear from you!                                                                  ║
║                                                                                                   ║
║  P.S. - This site was built with Next.js, TypeScript, and a lot of automotive passion.         ║
║         The background videos? Those are real builds and stories in action! 🔧📹               ║
║                                                                                                   ║
║                                Built with ❤️ and creativity                                      ║
║                                  Overdrive Originals                                              ║
║                                                                                                   ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝
-->
            `}
          </>
        )}
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative h-screen overflow-hidden`}>
        {/* Background video */}
        <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1000 }}>
          <BackgroundVideo videoDuration={videoDuration} crossfadeDuration={crossfadeDuration} />
        </div>

        {/* Main layout container - full viewport height */}
        <div className="h-screen flex flex-col">
          {/* Floating brand logo - responsive positioning */}
          <header className="flex-shrink-0 z-20">
            <div className="flex justify-center pt-2 xs:pt-3 sm:pt-4 md:pt-6 lg:pt-8">
              <Link href="/" className="text-white hover:opacity-80 transition-opacity block">
                <Image 
                  src="/oo.svg" 
                  alt="Overdrive Originals" 
                  width={154} 
                  height={154} 
                  className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-52 xl:h-52" 
                />
              </Link>
            </div>
          </header>

          {/* Page content - flexible center area */}
          <main className="flex-1 flex items-center justify-center px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="w-full max-w-7xl">
              {children}
            </div>
          </main>

          {/* Footer - bottom of viewport with proper z-index */}
          <footer className="flex-shrink-0 z-10 pb-2 xs:pb-3 sm:pb-4 md:pb-6 lg:pb-8">
            <div className="text-center text-white/70 text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs leading-relaxed px-4">
              © {new Date().getFullYear()} Overdrive Originals. All rights reserved.
              <br />
              This site participates in community-driven projects. All product names, logos, and brands are property of their respective owners.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
