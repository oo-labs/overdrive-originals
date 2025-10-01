'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface BackgroundVideoProps {
  videoDuration: number;
  crossfadeDuration: number;
}

export default function BackgroundVideo({ crossfadeDuration }: BackgroundVideoProps) {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 5 explicit video sources
  const video1Src = '/bg/bg_01.mp4';
  const video2Src = '/bg/bg_02.mp4';
  const video3Src = '/bg/bg_03.mp4';
  const video4Src = '/bg/bg_04.mp4';
  const video5Src = '/bg/bg_05.mp4';

  const videoSources = useMemo(() => [video1Src, video2Src, video3Src, video4Src, video5Src], []);

  // Preload all videos
  const preloadVideos = useCallback(() => {
    console.log('🎬 Starting video preload...');
    
    let preloadedCount = 0;
    
    videoSources.forEach((src, index) => {
      const videoElement = document.createElement('video');
      videoElement.src = src;
      videoElement.preload = 'auto';
      videoElement.muted = true;
      videoElement.crossOrigin = 'anonymous';
      
      const handleCanPlay = () => {
        preloadedCount++;
        console.log(`✅ Preloaded: bg_0${index + 1}.mp4`);
        
        // Start playing first video when all are preloaded
        if (preloadedCount === videoSources.length) {
          console.log('🎬 All videos preloaded, starting playback');
          if (video1Ref.current) {
            video1Ref.current.src = videoSources[0];
            video1Ref.current.play().catch(console.error);
          }
          if (video2Ref.current) {
            video2Ref.current.src = videoSources[1];
            video2Ref.current.load();
          }
          setIsPreloading(false);
        }
      };
      
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.load();
    });
  }, [videoSources]);

  // Initialize preloading
  useEffect(() => {
    preloadVideos();
  }, [preloadVideos]);

  // Start transition: fade out current video, fade in next video
  const startTransition = useCallback(() => {
    if (isTransitioning) return;
    
    const nextIndex = (currentVideoIndex + 1) % videoSources.length;
    const nextVideoSrc = videoSources[nextIndex];
    console.log(`🔄 Starting transition to: bg_0${nextIndex + 1}.mp4`);
    
    setIsTransitioning(true);
    
    // Get current and next video elements
    const currentVideo = video1Ref.current;
    const nextVideo = video2Ref.current;
    
    if (!currentVideo || !nextVideo) {
      setIsTransitioning(false);
      return;
    }
    
    // Set next video source and start playing immediately
    nextVideo.src = nextVideoSrc;
    nextVideo.currentTime = 0;
    nextVideo.play().catch(console.error);
    
    console.log('🎬 Both videos now playing simultaneously');
    
    // Start fade immediately - both videos are playing
    currentVideo.style.transition = `opacity ${crossfadeDuration}s ease-out`;
    currentVideo.style.opacity = '0';
    
    nextVideo.style.transition = `opacity ${crossfadeDuration}s ease-in`;
    nextVideo.style.opacity = '1';
    
    // After fade completes, prepare for next transition
    setTimeout(() => {
      console.log('✅ Transition complete, preparing next video');
      
      // Reset styles
      currentVideo.style.transition = '';
      currentVideo.style.opacity = '0'; // Keep faded video hidden
      nextVideo.style.transition = '';
      nextVideo.style.opacity = '1'; // Keep new video visible
      
      // Update index
      setCurrentVideoIndex(nextIndex);
      setIsTransitioning(false);
      
      // Load next video for next transition (don't swap srcs)
      const nextNextIndex = (nextIndex + 1) % videoSources.length;
      currentVideo.src = videoSources[nextNextIndex];
      currentVideo.load();
      
    }, crossfadeDuration * 1000);
  }, [currentVideoIndex, videoSources, crossfadeDuration, isTransitioning]);

  // Handle video events
  useEffect(() => {
    // The visible video is always video2 after the first transition
    const currentVideo = currentVideoIndex === 0 ? video1Ref.current : video2Ref.current;
    if (!currentVideo || isPreloading) return;
    
    const handleTimeUpdate = () => {
      // Start transition 2 seconds before current video ends
      const timeUntilEnd = currentVideo.duration - currentVideo.currentTime;
      const preloadBuffer = 2.0; // 2 seconds before end
      
      if (timeUntilEnd <= preloadBuffer && !isTransitioning) {
        console.log('⏰ Video near end, starting transition');
        startTransition();
      }
    };
    
    const handleEnded = () => {
      console.log('📹 Video ended naturally, starting transition');
      startTransition();
    };
    
    const handleError = (e: Event) => {
      console.error('❌ Video error:', e);
      startTransition();
    };
    
    currentVideo.addEventListener('timeupdate', handleTimeUpdate);
    currentVideo.addEventListener('ended', handleEnded);
    currentVideo.addEventListener('error', handleError);
    
    return () => {
      currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
      currentVideo.removeEventListener('ended', handleEnded);
      currentVideo.removeEventListener('error', handleError);
    };
  }, [isPreloading, startTransition, isTransitioning, currentVideoIndex]);

  return (
    <div className="relative h-full w-full">
      {/* Loading screen - shown during preload */}
      {isPreloading && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 flex items-center justify-center">
          <div className="text-white text-lg">Loading videos...</div>
        </div>
      )}
      
      {/* Video 1 - Primary video */}
      <video
        ref={video1Ref}
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
          opacity: 1,
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* Video 2 - Secondary video */}
      <video
        ref={video2Ref}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        loop={false}
        preload="auto"
        crossOrigin="anonymous"
        poster="/bg-poster.jpg"
        style={{ 
          zIndex: 1,
          opacity: 0,
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
}