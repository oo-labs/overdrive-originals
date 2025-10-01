'use client';

import { useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  videoDuration: number;
  crossfadeDuration: number;
}

export default function BackgroundVideo({ videoDuration, crossfadeDuration }: BackgroundVideoProps) {
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState<string>('bg_01.mp4');
  const [nextVideo, setNextVideo] = useState<string>('');
  const [isCrossfading, setIsCrossfading] = useState(false);
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Available videos (you can add more as needed)
  const availableVideos = ['bg_01.mp4', 'bg_02.mp4', 'bg_03.mp4', 'bg_04.mp4', 'bg_05.mp4'];

  // Get next video to play (avoiding the current video)
  const getNextVideo = (currentVideoName: string) => {
    // Filter out the current video to avoid immediate repeats
    const otherVideos = availableVideos.filter(video => video !== currentVideoName);
    const randomVideo = otherVideos[Math.floor(Math.random() * otherVideos.length)];
    console.log('🎬 getNextVideo called with current:', currentVideoName);
    console.log('🎬 Available videos:', availableVideos);
    console.log('🎬 Other videos (excluding current):', otherVideos);
    console.log('🎬 Selected next video:', randomVideo);
    return randomVideo;
  };

  // Start crossfade from video end
  const startCrossfadeFromEnd = () => {
    console.log('🔄 startCrossfadeFromEnd called');
    console.log('🔄 isCrossfading:', isCrossfading);
    console.log('🔄 currentVideoRef.current:', !!currentVideoRef.current);
    console.log('🔄 nextVideoRef.current:', !!nextVideoRef.current);
    console.log('🔄 nextVideo state:', nextVideo);
    
    if (isCrossfading || !currentVideoRef.current || !nextVideoRef.current) {
      console.log('🔄 Crossfade blocked - conditions not met');
      return;
    }
    
    const currentVideoElement = currentVideoRef.current;
    const nextVideoElement = nextVideoRef.current;
    const nextVideoName = nextVideo; // Store the next video name
    
    console.log('🔄 Starting crossfade from video end, duration:', crossfadeDuration);
    console.log('🔄 Current video element:', currentVideoElement.src);
    console.log('🔄 Next video element:', nextVideoElement.src);
    console.log('🔄 Next video name:', nextVideoName);
    
    setIsCrossfading(true);
    
    // Start the next video playing
    console.log('🔄 Starting next video playback');
    nextVideoElement.currentTime = 0;
    nextVideoElement.play().catch(console.error);
    
    // Set up crossfade transitions
    currentVideoElement.style.transition = `opacity ${crossfadeDuration}s ease-in-out`;
    nextVideoElement.style.transition = `opacity ${crossfadeDuration}s ease-in-out`;
    
    // Start fade out of current video and fade in of next video
    currentVideoElement.style.opacity = '0';
    nextVideoElement.style.opacity = '1';
    console.log('🔄 Crossfade started - current fading out, next fading in');
    
    // After crossfade completes, switch to next video
    crossfadeTimeoutRef.current = setTimeout(() => {
      console.log('✅ Crossfade complete, switching videos. Current:', nextVideoName);
      console.log('✅ Setting currentVideo to:', nextVideoName);
      
      // The next video is now the current video
      setCurrentVideo(nextVideoName);
      
      // Get the next video after this one (avoiding the current video)
      console.log('✅ Getting next video after crossfade...');
      const nextNextVideo = getNextVideo(nextVideoName);
      console.log('✅ Setting nextVideo to:', nextNextVideo);
      setNextVideo(nextNextVideo);
      
      setIsCrossfading(false);
      console.log('✅ Crossfade complete, isCrossfading set to false');
      
      // Reset styles
      if (currentVideoRef.current) {
        currentVideoRef.current.style.opacity = '1';
        currentVideoRef.current.style.transition = '';
      }
      if (nextVideoRef.current) {
        nextVideoRef.current.style.opacity = '0';
        nextVideoRef.current.style.transition = '';
      }
    }, crossfadeDuration * 1000);
  };

  // Handle current video events
  useEffect(() => {
    if (currentVideoRef.current && !isCrossfading) {
      const video = currentVideoRef.current;
      
      const handleLoadedData = () => {
        console.log('📹 Current video loaded:', currentVideo);
        video.currentTime = 0;
        video.play().catch(console.error);
        
        // Pre-load the next video (avoiding the current video)
        console.log('📹 Getting next video for current:', currentVideo);
        const nextVideoName = getNextVideo(currentVideo);
        console.log('📹 Setting nextVideo state to:', nextVideoName);
        setNextVideo(nextVideoName);
        console.log('📹 Current video loaded:', currentVideo, 'Next video prepared:', nextVideoName);
      };

      const handleTimeUpdate = () => {
        if (videoDuration === 0) {
          // For complete videos, start crossfade when video is near the end
          const timeUntilEnd = video.duration - video.currentTime;
          if (timeUntilEnd <= crossfadeDuration && !isCrossfading) {
            console.log('⏰ Video near end, starting crossfade. Time until end:', timeUntilEnd, 'Crossfade duration:', crossfadeDuration);
            startCrossfadeFromEnd();
          }
        } else {
          // For timed videos, start crossfade when time is up
          if (video.currentTime >= videoDuration && !isCrossfading) {
            console.log('⏰ Video duration reached, starting crossfade. Current time:', video.currentTime, 'Duration:', videoDuration);
            startCrossfadeFromEnd();
          }
        }
      };

      const handleEnded = () => {
        if (videoDuration === 0 && !isCrossfading) {
          console.log('Video ended naturally, starting crossfade');
          startCrossfadeFromEnd();
        }
      };

      const handleError = (e: Event) => {
        console.error('Video error:', e);
        startCrossfadeFromEnd();
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
        if (crossfadeTimeoutRef.current) {
          clearTimeout(crossfadeTimeoutRef.current);
        }
      };
    }
  }, [currentVideo, videoDuration, crossfadeDuration, isCrossfading]);

  // Handle next video loading
  useEffect(() => {
    console.log('🎯 Next video effect triggered. nextVideo:', nextVideo, 'isCrossfading:', isCrossfading);
    if (nextVideoRef.current && nextVideo && !isCrossfading) {
      const video = nextVideoRef.current;
      console.log('🎯 Next video element found, setting up event listener for:', nextVideo);
      
      const handleLoadedData = () => {
        // Next video is ready, set it to 50% opacity and prepare for crossfade
        video.style.opacity = '0.5';
        console.log('🎯 Next video loaded and ready:', nextVideo);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      
      return () => {
        console.log('🎯 Cleaning up next video event listener for:', nextVideo);
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [nextVideo, isCrossfading]);

  // Initialize with first video
  useEffect(() => {
    const firstVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
    console.log('🚀 Initializing with first video:', firstVideo);
    setCurrentVideo(firstVideo);
    console.log('🚀 Initialized with video:', firstVideo);
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Next video (behind current video) */}
      {nextVideo && (
        <video
          ref={nextVideoRef}
          key={nextVideo}
          className="absolute inset-0 h-full w-full object-cover opacity-0 z-0"
          muted
          playsInline
          loop={false}
          src={`/bg/${nextVideo}`}
        />
      )}
      
      {/* Current video (on top) */}
      <video
        ref={currentVideoRef}
        key={currentVideo}
        className="absolute inset-0 h-full w-full object-cover z-10"
        muted
        playsInline
        autoPlay
        loop={false}
        poster="/bg-poster.jpg"
        src={`/bg/${currentVideo}`}
      />
    </div>
  );
}
