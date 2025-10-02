import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const youtubeUrl = process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://youtube.com";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";
  const tiles = [
    { href: "/about", title: "About", subtitle: "", icon: "/about.svg", external: false },
    { href: "/race-support", title: "Race Support", subtitle: "Esse Werks Shop Build", icon: "/racesupport.svg", external: false },
    { href: "/second-chance-customs", title: "Second Chance", subtitle: "Coming Soon", icon: "/scc.svg", external: false, static: true },
    { href: "/merch", title: "Merch", subtitle: "", icon: "/merch.svg", external: false },
    { href: youtubeUrl, title: "YouTube", subtitle: "", icon: "/youtube.svg", external: true },
    { href: instagramUrl, title: "Instagram", subtitle: "", icon: "/instagram.svg", external: true },
  ];

  return (
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 w-full place-items-center">
        {tiles.map((tile) => {
          const tileClasses = `glass block p-1 xs:p-1.5 sm:p-2 md:p-2.5 lg:p-3 w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 ${
            tile.static 
              ? "opacity-60" 
              : "tile-glow tile-button group hover:scale-110 active:scale-95"
          }`;
          
          const iconClasses = `w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 mb-1 xs:mb-1.5 sm:mb-2 md:mb-2.5 lg:mb-3 ${
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
              <div className={`font-bold text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg tracking-wide mb-0.5 xs:mb-1 sm:mb-1 leading-tight ${
                tile.static ? "text-white" : "tile-text"
              }`}>
                {tile.title}
              </div>
              {tile.subtitle && (
                <div className={`text-[8px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight ${
                  tile.static ? "text-white/70" : "tile-subtitle"
                }`}>
                  {tile.subtitle}
                </div>
              )}
            </div>
          );

          if (tile.static) {
            return (
              <div key={tile.title} className={tileClasses}>
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
            >
              {tileContent}
            </a>
          ) : (
            <Link
              key={tile.title}
              href={tile.href}
              className={tileClasses}
            >
              {tileContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
