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
    { href: youtubeUrl, title: "OO YouTube", subtitle: "Channel", icon: "/youtube.svg", external: true },
    { href: instagramUrl, title: "Instagram", subtitle: "@overdriveoriginals", icon: "/instagram.svg", external: true },
  ];

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16">
      <section className="mt-6 sm:mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tiles.map((tile) => (
            tile.external ? (
              <a
                key={tile.title}
                href={tile.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass group block p-5 sm:p-6 transition hover:bg-white/15 ${tile.comingSoon ? "opacity-80" : ""}`}
              >
                <div className="flex items-center gap-3">
                  {tile.icon ? (
                    <Image src={tile.icon} alt="" width={24} height={24} className="opacity-90" />
                  ) : (
                    <div className="h-6 w-6 rounded-md bg-white/20" />
                  )}
                  <div>
                    <div className="text-white font-semibold tracking-wide">{tile.title}</div>
                    <div className="text-white/70 text-sm">{tile.subtitle}</div>
                  </div>
                </div>
              </a>
            ) : (
              <Link
                key={tile.title}
                href={tile.href}
                className={`glass group block p-5 sm:p-6 transition hover:bg-white/15 ${tile.comingSoon ? "opacity-80" : ""}`}
              >
                <div className="flex items-center gap-3">
                  {tile.icon ? (
                    <Image src={tile.icon} alt="" width={24} height={24} className="opacity-90" />
                  ) : (
                    <div className="h-6 w-6 rounded-md bg-white/20" />
                  )}
                  <div>
                    <div className="text-white font-semibold tracking-wide">{tile.title}</div>
                    <div className="text-white/70 text-sm">{tile.subtitle}</div>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>
      </section>
    </main>
  );
}
