import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";
  const tiles = [
    { href: "/about", title: "About", subtitle: "", icon: "/about.svg", external: false },
    { href: "/race-support", title: "Race Support", subtitle: "Esse Werks Shop Truck Build", icon: "/racesupport.svg", external: false },
    { href: "/second-chance-customs", title: "Second Chance", subtitle: "Coming Soon", icon: "/scc.svg", external: false, static: true },
    { href: "/merch", title: "Merch", subtitle: "", icon: "/merch.svg", external: false },
    { href: youtubeUrl, title: "YouTube", subtitle: "", icon: "/youtube.svg", external: true },
    { href: instagramUrl, title: "Instagram", subtitle: "", icon: "/instagram.svg", external: true },
  ];

  return (
    <main className="relative z-10 w-full h-full flex items-center justify-center px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-16 lg:gap-20 max-w-6xl w-full place-items-center">
        {tiles.map((tile) => {
          const tileClasses = `glass block aspect-square p-1 sm:p-2 ${
            tile.static 
              ? "opacity-60" 
              : "tile-glow tile-button group hover:scale-110 active:scale-95"
          }`;
          
          const iconClasses = `w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-2 sm:mb-3 ${
            tile.static ? "opacity-60" : "tile-svg opacity-80 group-hover:opacity-100 group-hover:scale-110"
          }`;
          
          const tileContent = (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={iconClasses}>
                <Image 
                  src={tile.icon} 
                  alt={tile.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <div className={`font-bold text-xs sm:text-sm lg:text-base tracking-wide mb-1 leading-tight ${
                tile.static ? "text-white" : "tile-text"
              }`}>
                {tile.title}
              </div>
              {tile.subtitle && (
                <div className={`text-xs leading-tight ${
                  tile.static ? "text-white/70" : "tile-subtitle"
                }`}>
                  {tile.subtitle}
                </div>
              )}
            </div>
          );

          if (tile.static) {
            return (
              <div key={tile.title} className={tileClasses} style={{ width: 'calc(100% - 40px)', height: 'calc(100% - 40px)' }}>
                {tileContent}
              </div>
            );
          }

          return tile.external ? (
            <a
              key={tile.title}
              href={tile.href}
              target="_blank"
              rel="noopener noreferrer"
              className={tileClasses}
              style={{ width: 'calc(100% - 40px)', height: 'calc(100% - 40px)' }}
            >
              {tileContent}
            </a>
          ) : (
            <Link
              key={tile.title}
              href={tile.href}
              className={tileClasses}
              style={{ width: 'calc(100% - 40px)', height: 'calc(100% - 40px)' }}
            >
              {tileContent}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
