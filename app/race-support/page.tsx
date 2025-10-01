import Link from "next/link";

export default function RaceSupport() {
  return (
    <main className="relative z-10 w-full h-full flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="glass p-8 sm:p-12 border border-black">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Race Support
            </h1>
            <p className="text-white/80 text-lg sm:text-xl">
              Esse Werks Shop Truck Build
            </p>
          </div>
          
          <div className="text-white/90 text-base sm:text-lg leading-relaxed space-y-6">
            <p>
              Our Race Support program focuses on the Esse Werks Shop Truck Build - 
              a comprehensive project that showcases our commitment to automotive excellence.
            </p>
            
            <p>
              This build represents the perfect blend of performance, reliability, and 
              functionality, designed to support racing operations while maintaining 
              the highest standards of quality.
            </p>
            
            <p>
              Follow along as we document every step of this exciting build, from 
              initial planning to final execution and track testing.
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-block glass px-6 py-3 border border-white/30 text-white hover:bg-white/10 transition-all duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}