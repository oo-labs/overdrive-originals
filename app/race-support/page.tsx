'use client';

import Link from "next/link";
import { useState } from "react";

export default function RaceSupport() {
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          instagram: instagram.trim() || undefined,
          source: 'race-support',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('🎉 Welcome to the revolution! Thank you for sharing your info with us. You\'re now part of the exclusive Race Support insider community and will be the first to know about build updates, voting opportunities, and behind-the-scenes content.');
        setEmail('');
        setInstagram('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
        setIsError(true);
      }
    } catch {
      setMessage('Network error. Please check your connection and try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="relative z-10 w-full h-full flex items-center justify-center px-4 py-4">
      <div className="max-w-4xl w-full flex flex-col" style={{ height: 'calc(100vh - clamp(160px, 20vh, 240px))' }}>
        <div className="glass border border-black flex-1 flex flex-col min-h-0 max-h-full">
          {/* Fixed header */}
          <div className="flex-shrink-0 text-center p-8 sm:p-12 pb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              This Isn&apos;t a Project. It&apos;s a Revolution.
            </h1>
          </div>
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto content-scroll px-8 sm:px-12">
            <div className="text-white/90 text-base sm:text-lg leading-relaxed space-y-6 pb-6">
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
                  <h4 className="font-semibold text-white mb-2">Access the Raw & Uncut Feed:</h4>
                  <p className="text-white/80">
                    Go beyond the polished YouTube cuts. As an insider, you&apos;ll get access to the unedited video logs, 
                    the build team&apos;s photo dumps, and the schematic sketches straight from the whiteboard. See the real 
                    moments—the challenges, the debates, and the breakthroughs—that never make it to the main channel.
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
              
              {message && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  isError 
                    ? 'bg-red-900/20 border-red-500/30 text-red-200' 
                    : 'bg-green-900/20 border-green-500/30 text-green-200'
                }`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-black/30 border border-white/30 rounded text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="Instagram handle (optional)"
                    className="w-full px-4 py-3 bg-black/30 border border-white/30 rounded text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 border border-green-500 text-white transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? 'Joining...' : 'Join the Revolution'}
                </button>
                
                <p className="text-xs text-white/60 text-center mt-3">
                  We respect your privacy. Your information will only be used to send you exclusive Race Support updates and will never be shared with third parties. You can unsubscribe at any time.
                </p>
              </form>
            </div>
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