import Link from "next/link";

export default function About() {
  return (
    <main className="relative z-10 w-full h-full flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="glass p-8 sm:p-12 border border-black">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              About
            </h1>
            <p className="text-white/80 text-lg sm:text-xl">
              Learn more about Overdrive Originals
            </p>
          </div>
          
          <div className="text-white/90 text-base sm:text-lg leading-relaxed space-y-6">
            <p>
              Overdrive Originals is a content studio by Esse Werks, dedicated to creating 
              high-quality automotive content and supporting the racing community.
            </p>
            
            <p>
              Our mission is to document and share the passion for automotive excellence, 
              from race support to custom builds and everything in between.
            </p>
            
            <p>
              Through our various projects including Race Support and Second Chance Customs, 
              we aim to showcase the artistry and engineering that goes into every build.
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