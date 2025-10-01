import Link from "next/link";

export default function Merch() {
  return (
    <main className="relative z-10 w-full h-full flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        <div className="glass p-8 sm:p-12 border border-black bg-black/60">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Merch
            </h1>
            <p className="text-white/80 text-lg sm:text-xl">
              Official Overdrive Originals Merchandise
            </p>
          </div>
          
          <div className="text-white/90 text-base sm:text-lg leading-relaxed space-y-6">
            <p>
              Shop our exclusive collection of Overdrive Originals merchandise, 
              featuring high-quality apparel and accessories.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="glass p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3">Coming Soon</h3>
                <p className="text-white/70">Shopify integration in development</p>
              </div>
              <div className="glass p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3">Brand Integration</h3>
                <p className="text-white/70">Multi-brand store with custom checkout</p>
              </div>
              <div className="glass p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-3">Quality Products</h3>
                <p className="text-white/70">Premium merchandise for automotive enthusiasts</p>
              </div>
            </div>
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
