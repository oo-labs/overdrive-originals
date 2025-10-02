import Link from "next/link";

export default function About() {
  return (
    <main className="relative z-10 w-full h-full flex items-center justify-center px-4 py-4">
      <div className="max-w-4xl w-full flex flex-col" style={{ height: 'calc(100vh - clamp(160px, 20vh, 240px))' }}>
        <div className="glass border border-black flex-1 flex flex-col min-h-0 max-h-full">
          {/* Fixed header */}
          <div className="flex-shrink-0 text-center p-8 sm:p-12 pb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              We Are the Storytellers of the Automotive Soul.
            </h1>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto content-scroll px-8 sm:px-12">
            <div className="text-white/90 text-base sm:text-lg leading-relaxed space-y-6 pb-6">
              <p>
                Some people see cars as appliances. A to B. Pointless hunks of metal. We see them differently. 
                We see the late nights in the garage, the busted knuckles, the smell of race fuel, and the 
                relentless pursuit of perfection. We see the stories etched in every dent, every modification, 
                every mile marker.
              </p>
              
              <p>
                Overdrive Originals was born from this obsession. We&apos;re not just a content studio; we&apos;re a 
                global community of builders, dreamers, and drivers who believe that a car can be more than 
                just a machine. It can be a work of art, a statement of identity, a vessel for adventure.
              </p>
              
              <p>
                We&apos;re here to tell the stories that matter. The stories of the underdogs who build champions 
                in their home garages. The stories of the legends who push the limits of what&apos;s possible. 
                The stories that remind us why we fell in love with cars in the first place.
              </p>
              
              <p>
                This isn&apos;t just about cars. It&apos;s about the culture that surrounds them. It&apos;s about the passion 
                that unites us. It&apos;s about the drive to create something extraordinary.
              </p>
              
              <p className="text-xl sm:text-2xl font-semibold text-white">
                Join us. Let&apos;s tell your story.
              </p>
            </div>
          </div>
          
          {/* Fixed footer */}
          <div className="flex-shrink-0 text-center p-8 sm:p-12 pt-4">
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