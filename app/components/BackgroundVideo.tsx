'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  videoDuration: number;
  crossfadeDuration: number;
}

// Available videos from /bg folder
const availableVideos = ['bg_01.mp4', 'bg_02.mp4', 'bg_03.mp4', 'bg_04.mp4', 'bg_05.mp4'];

export default function BackgroundVideo({ videoDuration, crossfadeDuration }: BackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  
  // Generate playlist: 5x the number of available videos
  const generatePlaylist = useCallback(() => {
    const newPlaylist: string[] = [];
    for (let i = 0; i < availableVideos.length * 5; i++) {
      const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      newPlaylist.push(randomVideo);
    }
    return newPlaylist;
  }, []);

  // Initialize playlist and first video
  useEffect(() => {
    const newPlaylist = generatePlaylist();
    setPlaylist(newPlaylist);
    console.log('🎬 Playlist generated:', newPlaylist.length, 'videos');
  }, [generatePlaylist]);

  // Get next video from playlist
  const getNextVideo = useCallback(() => {
    const nextIndex = (currentVideoIndex + 1) % playlist.length;
    return playlist[nextIndex];
  }, [currentVideoIndex, playlist]);


  // Start transition to next video
  const startTransition = useCallback(() => {
    if (isTransitioning) return;
    
    const nextVideoSrc = getNextVideo();
    console.log('🔄 Starting transition to:', nextVideoSrc);
    
    setIsTransitioning(true);
    
    // Set up crossfade: fade out current video
    if (currentVideoRef.current) {
      currentVideoRef.current.style.transition = `opacity ${crossfadeDuration}s ease-out`;
      currentVideoRef.current.style.opacity = '0';
    }
    
    // After crossfade completes, move to next video
    setTimeout(() => {
      console.log('✅ Transition complete');
      
      // Update playlist index (this will trigger React to render new video)
      setCurrentVideoIndex(prev => (prev + 1) % playlist.length);
      setIsTransitioning(false);
      setIsPreloading(false); // Reset preloading state
      
      // Hide loading screen if it was showing
      setIsLoading(false);
    }, crossfadeDuration * 1000);
  }, [isTransitioning, getNextVideo, crossfadeDuration, playlist.length]);

  // Handle current video events
  useEffect(() => {
    if (!currentVideoRef.current || !playlist.length) return;
    
    const video = currentVideoRef.current;
    
    const handleLoadedData = () => {
      console.log('📹 Current video loaded:', playlist[currentVideoIndex]);
      video.currentTime = 0;
      video.play().catch(console.error);
      setIsLoading(false);
    };
    
    const handleTimeUpdate = () => {
      if (videoDuration === 0) {
        // For complete videos
        const timeUntilEnd = video.duration - video.currentTime;
        const preloadBuffer = crossfadeDuration + 3.0; // Start preloading 3 seconds before crossfade
        const transitionBuffer = crossfadeDuration + 0.5; // Start crossfade 500ms before end
        
        // Start preloading next video 3 seconds before crossfade
        if (timeUntilEnd <= preloadBuffer && !isPreloading && !isTransitioning) {
          console.log('🎬 Starting preload 3 seconds before crossfade');
          setIsPreloading(true);
        }
        
        // Start crossfade when near the end
        if (timeUntilEnd <= transitionBuffer && !isTransitioning) {
          console.log('⏰ Video near end, starting crossfade');
          startTransition();
        }
      } else {
        // For timed videos
        const timeUntilEnd = videoDuration - video.currentTime;
        const preloadBuffer = crossfadeDuration + 3.0; // Start preloading 3 seconds before crossfade
        
        // Start preloading next video 3 seconds before crossfade
        if (timeUntilEnd <= preloadBuffer && !isPreloading && !isTransitioning) {
          console.log('🎬 Starting preload 3 seconds before crossfade');
          setIsPreloading(true);
        }
        
        // Start crossfade when time is up
        if (video.currentTime >= videoDuration && !isTransitioning) {
          console.log('⏰ Video duration reached, starting crossfade');
          startTransition();
        }
      }
    };
    
    const handleEnded = () => {
      if (videoDuration === 0 && !isTransitioning) {
        console.log('📹 Video ended naturally, starting transition');
        startTransition();
      }
    };
    
    const handleError = (e: Event) => {
      console.error('❌ Video error:', e);
      startTransition();
    };
    
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [currentVideoIndex, playlist, videoDuration, crossfadeDuration, isTransitioning, startTransition]);

  return (
    <div className="relative h-full w-full">
      {/* Loading screen - only shown during initial load */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 flex items-center justify-center"
          style={{ zIndex: 999 }}
        >
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}
      
      {/* Video container */}
      <div ref={containerRef} className="relative h-full w-full">
        {/* Next video (behind current video during preload and transition) */}
        {(isPreloading || isTransitioning) && playlist.length > 0 && (
          <video
            ref={nextVideoRef}
            key={`next-${playlist[(currentVideoIndex + 1) % playlist.length]}`}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            autoPlay
            loop={false}
            preload="auto"
            crossOrigin="anonymous"
            poster="/bg-poster.jpg"
            style={{ 
              zIndex: 1,
              willChange: 'opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
            src={`/bg/${playlist[(currentVideoIndex + 1) % playlist.length]}`}
          />
        )}
        
        {/* Current video */}
        {playlist.length > 0 && (
          <video
            ref={currentVideoRef}
            key={playlist[currentVideoIndex]}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            autoPlay
            loop={false}
            preload="auto"
            crossOrigin="anonymous"
            poster="/bg-poster.jpg"
            style={{ 
              zIndex: 2,
              willChange: 'opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
            src={`/bg/${playlist[currentVideoIndex]}`}
          />
        )}
      </div>
    </div>
  );
}