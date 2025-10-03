'use client';

import { useEffect, useRef, useState } from 'react';

export default function StoreBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1000 }}>
      <div className="relative h-full w-full">
        {/* Dimmed overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 flex items-center justify-center">
          {!isLoaded && (
            <div className="text-white text-lg">Loading store...</div>
          )}
        </div>
        
        {/* Checkered flag background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          autoPlay
          preload="auto"
          crossOrigin="anonymous"
          poster="/bg-poster.jpg"
          style={{
            zIndex: 1,
            opacity: isLoaded ? 0.3 : 0, // Dimmed to 30% opacity
            willChange: 'opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        >
          <source src="/bg/checkered-flag.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
