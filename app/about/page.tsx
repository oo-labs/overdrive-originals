'use client';

import Link from "next/link";
import { useState } from "react";

export default function About() {
  const [email, setEmail] = useState('');
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
          source: 'about',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('🎉 Thank you for joining the Overdrive Originals community! You\'ll be the first to know about new series, episodes, limited merch drops, collaborations, and more exclusive content.');
        setEmail('');
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
              
              <div className="text-center mt-6 p-4 bg-black/20 rounded-lg border border-white/10">
                <p className="text-white/80 text-sm">
                  Want to get in touch? Reach us at{' '}
                  <a 
                    href="mailto:hello@overdriveoriginals.com" 
                    className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
                  >
                    hello@overdriveoriginals.com
                  </a>
                </p>
              </div>
              
              {/* Email signup form */}
              <div className="bg-black/50 p-6 rounded-lg border border-white/30 mt-8">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Stay Connected</h3>
                <p className="text-white/80 text-center mb-6">
                  Share your email address with us to be notified about new series and episodes, limited merch drops, collaborations, and more.
                </p>
                
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
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 border border-green-500 text-white transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? 'Joining...' : 'Join the Community'}
                  </button>
                  
                  <p className="text-xs text-white/60 text-center mt-3">
                    We respect your privacy. Your information will only be used to send you Overdrive Originals updates and will never be shared with third parties. You can unsubscribe at any time.
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