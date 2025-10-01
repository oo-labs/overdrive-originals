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
  const [activeVideo, setActiveVideo] = useState<'video1' | 'video2'>('video1');

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

  // Ping-pong to next video
  const pingPongToNext = useCallback(() => {
    const nextIndex = (currentVideoIndex + 1) % videoSources.length;
    const nextVideoSrc = videoSources[nextIndex];
    console.log(`🔄 Ping-pong to: bg_0${nextIndex + 1}.mp4`);
    
    // Get current and next video elements
    const currentVideo = activeVideo === 'video1' ? video1Ref.current : video2Ref.current;
    const nextVideo = activeVideo === 'video1' ? video2Ref.current : video1Ref.current;
    
    if (!currentVideo || !nextVideo) return;
    
    // Set next video source and start playing
    nextVideo.src = nextVideoSrc;
    nextVideo.currentTime = 0;
    nextVideo.play().catch(console.error);
    
    // Wait for next video to start playing, then fade
    const handleCanPlay = () => {
      nextVideo.removeEventListener('canplay', handleCanPlay);
      
      console.log('🎬 Next video started playing, starting fade');
      
      // Fade out current video
      currentVideo.style.transition = `opacity ${crossfadeDuration}s ease-out`;
      currentVideo.style.opacity = '0';
      
      // After fade completes, switch active video
      setTimeout(() => {
        console.log('✅ Ping-pong complete');
        
        // Switch active video
        setActiveVideo(prev => prev === 'video1' ? 'video2' : 'video1');
        setCurrentVideoIndex(nextIndex);
        
        // Reset current video for next ping-pong
        currentVideo.style.transition = '';
        currentVideo.style.opacity = '1';
      }, crossfadeDuration * 1000);
    };
    
    nextVideo.addEventListener('canplay', handleCanPlay);
  }, [currentVideoIndex, videoSources, activeVideo, crossfadeDuration]);

  // Handle video events
  useEffect(() => {
    const currentVideo = activeVideo === 'video1' ? video1Ref.current : video2Ref.current;
    if (!currentVideo || isPreloading) return;
    
    const handleEnded = () => {
      console.log('📹 Video ended naturally, ping-pong');
      pingPongToNext();
    };
    
    const handleError = (e: Event) => {
      console.error('❌ Video error:', e);
      pingPongToNext();
    };
    
    currentVideo.addEventListener('ended', handleEnded);
    currentVideo.addEventListener('error', handleError);
    
    return () => {
      currentVideo.removeEventListener('ended', handleEnded);
      currentVideo.removeEventListener('error', handleError);
    };
  }, [isPreloading, activeVideo, pingPongToNext]);

  return (
    <div className="relative h-full w-full">
      {/* Loading screen - shown during preload */}
      {isPreloading && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 flex items-center justify-center">
          <div className="text-white text-lg">Loading videos...</div>
        </div>
      )}
      
      {/* Video 1 - Background layer */}
      <video
        ref={video1Ref}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        loop={false}
        preload="auto"
        crossOrigin="anonymous"
        poster="/bg-poster.jpg"
        style={{ 
          zIndex: activeVideo === 'video1' ? 2 : 1,
          opacity: activeVideo === 'video1' ? 1 : 0,
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* Video 2 - Background layer */}
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
          zIndex: activeVideo === 'video2' ? 2 : 1,
          opacity: activeVideo === 'video2' ? 1 : 0,
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
}