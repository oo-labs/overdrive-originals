import Link from "next/link";

export default function RaceSupport() {
  return (
    <main className="relative z-10 w-full h-full flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="glass p-8 sm:p-12 border border-black">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              This Isn&apos;t a Project. It&apos;s a Revolution.
            </h1>
          </div>
          
          <div className="text-white/90 text-base sm:text-lg leading-relaxed space-y-6">
            <p>
              Welcome to the inner circle. What you&apos;re about to witness is more than just a build. 
              It&apos;s the birth of a legend. The Esse Werks Shop Truck isn&apos;t just a vehicle; it&apos;s a 
              statement. It&apos;s the physical manifestation of our commitment to the racing community.
            </p>
            
            <p className="text-xl font-semibold text-white">
              But here&apos;s the secret: this is your build too.
            </p>
            
            <p>
              We&apos;re throwing open the garage doors and inviting you to be a part of every decision, 
              every weld, every turn of the wrench. This is your chance to go behind the scenes, 
              to learn from the best, and to leave your mark on a piece of automotive history.
            </p>
            
            <div className="bg-black/30 p-6 rounded-lg border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Here&apos;s how you get in on the action:</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Weekly Insider Debriefs:</h4>
                  <p className="text-white/80">
                    Get exclusive access to our build team&apos;s private discussions. You&apos;ll hear the debates, 
                    the breakthroughs, and the &ldquo;aha!&rdquo; moments that no one else gets to see.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Vote on the Build:</h4>
                  <p className="text-white/80">
                    From the choice of tires to the final livery, you&apos;ll have a say in the critical 
                    decisions that will shape this beast.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Member-Only Q&As:</h4>
                  <p className="text-white/80">
                    Get your questions answered directly by our master builders and engineers in our 
                    private, members-only forums.
                  </p>
                </div>
              </div>
            </div>
            
            <p>
              This is your opportunity to be more than just a spectator. This is your chance to be 
              a part of the team.
            </p>
            
            <p className="text-xl sm:text-2xl font-bold text-white text-center">
              The revolution is starting. Are you in?
            </p>
            
            <div className="bg-black/50 p-6 rounded-lg border border-white/30">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Join the Insider&apos;s List</h3>
              <form className="space-y-4">
                <div>
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-black/30 border border-white/30 rounded text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Your name (optional)"
                    className="w-full px-4 py-3 bg-black/30 border border-white/30 rounded text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full glass px-6 py-3 border border-cyan-400/50 text-white hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 font-semibold"
                >
                  Join the Revolution
                </button>
              </form>
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