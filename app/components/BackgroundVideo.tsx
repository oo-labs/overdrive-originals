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

  // Preload a video
  const preloadVideo = useCallback((videoSrc: string): Promise<HTMLVideoElement> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = `/bg/${videoSrc}`;
      video.muted = true;
      video.playsInline = true;
      video.loop = false;
      video.preload = 'auto';
      video.crossOrigin = 'anonymous';
      
      // Style the video
      video.style.position = 'absolute';
      video.style.top = '0';
      video.style.left = '0';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.opacity = '0';
      video.style.zIndex = '1';
      video.style.willChange = 'opacity';
      video.style.transform = 'translateZ(0)';
      video.style.backfaceVisibility = 'hidden';
      
      // Add to container
      if (containerRef.current) {
        containerRef.current.appendChild(video);
      }
      
      const handleCanPlayThrough = () => {
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('error', handleError);
        console.log('✅ Video preloaded:', videoSrc);
        resolve(video);
      };
      
      const handleError = (e: Event) => {
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('error', handleError);
        console.error('❌ Failed to preload video:', videoSrc, e);
        reject(e);
      };
      
      video.addEventListener('canplaythrough', handleCanPlayThrough);
      video.addEventListener('error', handleError);
    });
  }, []);

  // Start transition to next video
  const startTransition = useCallback(async () => {
    if (isTransitioning || !currentVideoRef.current) return;
    
    const nextVideoSrc = getNextVideo();
    console.log('🔄 Starting transition to:', nextVideoSrc);
    
    setIsTransitioning(true);
    
    try {
      // Preload the next video
      const nextVideo = await preloadVideo(nextVideoSrc);
      nextVideoRef.current = nextVideo;
      
      // Start playing the next video immediately (behind current video)
      nextVideo.currentTime = 0;
      await nextVideo.play();
      
      // Set up crossfade: fade out current video
      if (currentVideoRef.current) {
        currentVideoRef.current.style.transition = `opacity ${crossfadeDuration}s ease-out`;
        currentVideoRef.current.style.opacity = '0';
      }
      
      // After crossfade completes, clean up and move to next video
      setTimeout(() => {
        console.log('✅ Transition complete');
        
        // Remove old current video
        if (currentVideoRef.current && currentVideoRef.current.parentNode) {
          currentVideoRef.current.parentNode.removeChild(currentVideoRef.current);
        }
        
        // Make next video the current video
        if (nextVideoRef.current) {
          nextVideoRef.current.style.opacity = '1';
          nextVideoRef.current.style.transition = '';
          nextVideoRef.current.style.zIndex = '2';
          currentVideoRef.current = nextVideoRef.current;
          nextVideoRef.current = null;
        }
        
        // Update playlist index
        setCurrentVideoIndex(prev => (prev + 1) % playlist.length);
        setIsTransitioning(false);
        
        // Hide loading screen if it was showing
        setIsLoading(false);
      }, crossfadeDuration * 1000);
      
    } catch (error) {
      console.error('❌ Transition failed:', error);
      setIsTransitioning(false);
    }
  }, [isTransitioning, getNextVideo, preloadVideo, crossfadeDuration, playlist.length]);

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
        // For complete videos, start transition when near the end
        const timeUntilEnd = video.duration - video.currentTime;
        const transitionBuffer = crossfadeDuration + 0.5; // 500ms buffer
        if (timeUntilEnd <= transitionBuffer && !isTransitioning) {
          console.log('⏰ Video near end, starting transition');
          startTransition();
        }
      } else {
        // For timed videos, start transition when time is up
        if (video.currentTime >= videoDuration && !isTransitioning) {
          console.log('⏰ Video duration reached, starting transition');
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