'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface BackgroundVideoProps {
  videoDuration: number;
  crossfadeDuration: number;
}

export default function BackgroundVideo({ videoDuration }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);

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
        if (preloadedCount === videoSources.length && videoRef.current) {
          console.log('🎬 All videos preloaded, starting playback');
          videoRef.current.src = videoSources[0];
          videoRef.current.play().catch(console.error);
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

  // Move to next video (instant cut)
  const moveToNextVideo = useCallback(() => {
    const nextIndex = (currentVideoIndex + 1) % videoSources.length;
    console.log(`🔄 Instant cut to: bg_0${nextIndex + 1}.mp4`);
    
    if (videoRef.current) {
      videoRef.current.src = videoSources[nextIndex];
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
      setCurrentVideoIndex(nextIndex);
    }
  }, [currentVideoIndex, videoSources]);

  // Handle video events
  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo || isPreloading) return;
    
    const handleTimeUpdate = () => {
      if (videoDuration === 0) {
        // For complete videos, cut when near the end
        const timeUntilEnd = currentVideo.duration - currentVideo.currentTime;
        const cutBuffer = 0.1; // 100ms buffer for instant cut
        if (timeUntilEnd <= cutBuffer) {
          console.log('⏰ Video near end, instant cut');
          moveToNextVideo();
        }
      } else {
        // For timed videos, cut when time is up
        if (currentVideo.currentTime >= videoDuration) {
          console.log('⏰ Video duration reached, instant cut');
          moveToNextVideo();
        }
      }
    };
    
    const handleEnded = () => {
      if (videoDuration === 0) {
        console.log('📹 Video ended naturally, instant cut');
        moveToNextVideo();
      }
    };
    
    const handleError = (e: Event) => {
      console.error('❌ Video error:', e);
      moveToNextVideo();
    };
    
    currentVideo.addEventListener('timeupdate', handleTimeUpdate);
    currentVideo.addEventListener('ended', handleEnded);
    currentVideo.addEventListener('error', handleError);
    
    return () => {
      currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
      currentVideo.removeEventListener('ended', handleEnded);
      currentVideo.removeEventListener('error', handleError);
    };
  }, [isPreloading, videoDuration, moveToNextVideo]);

  return (
    <div className="relative h-full w-full">
      {/* Loading screen - shown during preload */}
      {isPreloading && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 flex items-center justify-center">
          <div className="text-white text-lg">Loading videos...</div>
        </div>
      )}
      
      {/* Single video element */}
      <video
        ref={videoRef}
        key={`video-${currentVideoIndex}`}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        autoPlay
        loop={false}
        preload="auto"
        crossOrigin="anonymous"
        poster="/bg-poster.jpg"
        style={{ 
          willChange: 'auto',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
}