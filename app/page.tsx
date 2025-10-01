import Link from "next/link";

export default function Home() {
  const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";
  const tiles = [
    { href: "/about", title: "About", subtitle: "", icon: "ℹ️", external: false },
    { href: "/race-support", title: "Race Support", subtitle: "E53 4.8is Build", icon: "🏁", external: false },
    { href: "/second-chance-customs", title: "Second Chance", subtitle: "Coming Soon", icon: "🔧", external: false, comingSoon: true },
    { href: "/store", title: "Store", subtitle: "", icon: "🛒", external: false },
    { href: youtubeUrl, title: "YouTube", subtitle: "", icon: "📺", external: true },
    { href: instagramUrl, title: "Instagram", subtitle: "", icon: "📸", external: true },
  ];

  return (
    <main className="relative z-10 w-full h-full flex items-center justify-center px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20 max-w-6xl w-full">
        {tiles.map((tile) => (
          tile.external ? (
            <a
              key={tile.title}
              href={tile.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass group block aspect-square p-1 sm:p-2 transition-all duration-300 hover:bg-white/25 hover:scale-110 hover:shadow-2xl active:scale-95 border border-black ${tile.comingSoon ? "opacity-60" : ""}`}
              style={{ width: 'calc(100% - 40px)', height: 'calc(100% - 40px)' }}
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                  {tile.icon}
                </div>
                <div className="text-white font-bold text-xs sm:text-sm lg:text-base tracking-wide mb-1 leading-tight">
                  {tile.title}
                </div>
                {tile.subtitle && (
                  <div className="text-white/70 text-xs leading-tight">
                    {tile.subtitle}
                  </div>
                )}
              </div>
            </a>
          ) : (
            <Link
              key={tile.title}
              href={tile.href}
              className={`glass group block aspect-square p-1 sm:p-2 transition-all duration-300 hover:bg-white/25 hover:scale-110 hover:shadow-2xl active:scale-95 border border-black ${tile.comingSoon ? "opacity-60" : ""}`}
              style={{ width: 'calc(100% - 40px)', height: 'calc(100% - 40px)' }}
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                  {tile.icon}
                </div>
                <div className="text-white font-bold text-xs sm:text-sm lg:text-base tracking-wide mb-1 leading-tight">
                  {tile.title}
                </div>
                {tile.subtitle && (
                  <div className="text-white/70 text-xs leading-tight">
                    {tile.subtitle}
                  </div>
                )}
              </div>
            </Link>
          )
        ))}
      </div>
    </main>
  );
}
