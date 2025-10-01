import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";
  const tiles = [
    { href: "/", title: "Home", subtitle: "Overdrive Originals", icon: "/oo.svg", external: false },
    { href: "/about", title: "About the Studio", subtitle: "What and why", external: false },
    { href: "/race-support", title: "Race Support", subtitle: "E53 4.8is shop truck", external: false },
    { href: "/second-chance-customs", title: "Second Chance Customs", subtitle: "Coming Soon", external: false, comingSoon: true },
    { href: "/store", title: "Store", subtitle: "Parts, merch, more", external: false },
    { href: youtubeUrl, title: "OO YouTube", subtitle: "Channel", icon: "/YouTube.svg", external: true },
    { href: instagramUrl, title: "Instagram", subtitle: "@overdriveoriginals", icon: "/Instagram.svg", external: true },
  ];

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16">
      <section className="mt-6 sm:mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tiles.map((tile) => (
            tile.external ? (
              <a
                key={tile.title}
                href={tile.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass group block aspect-square p-6 transition hover:bg-white/15 ${tile.comingSoon ? "opacity-80" : ""}`}
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  {tile.icon ? (
                    <Image src={tile.icon} alt="" width={120} height={120} className="opacity-90 mb-4" />
                  ) : (
                    <div className="h-30 w-30 rounded-md bg-white/20 mb-4" />
                  )}
                  <div className="text-white font-bold text-lg tracking-wide mb-1">{tile.title}</div>
                  <div className="text-white/60 text-xs">{tile.subtitle}</div>
                </div>
              </a>
            ) : (
              <Link
                key={tile.title}
                href={tile.href}
                className={`glass group block aspect-square p-6 transition hover:bg-white/15 ${tile.comingSoon ? "opacity-80" : ""}`}
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  {tile.icon ? (
                    <Image src={tile.icon} alt="" width={120} height={120} className="opacity-90 mb-4" />
                  ) : (
                    <div className="h-30 w-30 rounded-md bg-white/20 mb-4" />
                  )}
                  <div className="text-white font-bold text-lg tracking-wide mb-1">{tile.title}</div>
                  <div className="text-white/60 text-xs">{tile.subtitle}</div>
                </div>
              </Link>
            )
          ))}
        </div>
      </section>
    </main>
  );
}
