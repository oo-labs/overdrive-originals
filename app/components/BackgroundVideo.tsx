'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  videoDuration: number;
  crossfadeDuration: number;
}

// Available videos from /bg folder
const availableVideos = ['bg_01.mp4', 'bg_02.mp4', 'bg_03.mp4', 'bg_04.mp4', 'bg_05.mp4'];

export default function BackgroundVideo({ videoDuration, crossfadeDuration }: BackgroundVideoProps) {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState<'video1' | 'video2'>('video1');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [, setPreloadedVideos] = useState<Set<number>>(new Set());
  const [video1Src, setVideo1Src] = useState<string>('');
  const [video2Src, setVideo2Src] = useState<string>('');

  // Preload all videos
  const preloadVideos = useCallback(() => {
    console.log('🎬 Starting video preload...');
    
    availableVideos.forEach((video, index) => {
      const videoElement = document.createElement('video');
      videoElement.src = `/bg/${video}`;
      videoElement.preload = 'auto';
      videoElement.muted = true;
      videoElement.crossOrigin = 'anonymous';
      
      const handleCanPlay = () => {
        console.log(`✅ Preloaded: ${video}`);
        setPreloadedVideos(prev => new Set([...prev, index]));
        
        // Start playing first video when third video is preloaded
        if (index === 2 && video1Ref.current) {
          console.log('🎬 Starting first video playback');
          setVideo1Src(`/bg/${availableVideos[0]}`);
          setIsPreloading(false);
        }
      };
      
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.load();
    });
  }, []);

  // Initialize preloading
  useEffect(() => {
    preloadVideos();
  }, [preloadVideos]);

  // Handle video playback when source is set
  useEffect(() => {
    if (video1Src && video1Ref.current && !isPreloading) {
      video1Ref.current.src = video1Src;
      video1Ref.current.play().catch(console.error);
    }
  }, [video1Src, isPreloading]);

  useEffect(() => {
    if (video2Src && video2Ref.current && !isPreloading) {
      video2Ref.current.src = video2Src;
      video2Ref.current.currentTime = 0;
    }
  }, [video2Src, isPreloading]);

  // Get next video index (cycles through availableVideos)
  const getNextVideoIndex = useCallback(() => {
    return (currentVideoIndex + 1) % availableVideos.length;
  }, [currentVideoIndex]);

  // Start transition to next video
  const startTransition = useCallback(() => {
    if (isTransitioning || isPreloading) return;
    
    const nextIndex = getNextVideoIndex();
    const nextVideoSrc = availableVideos[nextIndex];
    console.log('🔄 Starting transition to:', nextVideoSrc);
    
    setIsTransitioning(true);
    
    // Get current and next video elements
    const currentVideo = activeVideo === 'video1' ? video1Ref.current : video2Ref.current;
    const nextVideo = activeVideo === 'video1' ? video2Ref.current : video1Ref.current;
    
    if (!currentVideo || !nextVideo) return;
    
    // Set next video source
    const nextVideoPath = `/bg/${nextVideoSrc}`;
    if (activeVideo === 'video1') {
      setVideo2Src(nextVideoPath);
    } else {
      setVideo1Src(nextVideoPath);
    }
    
    // Wait for next video to be ready, then start playing and crossfade
    const handleCanPlay = () => {
      nextVideo.removeEventListener('canplay', handleCanPlay);
      
      // Start playing the next video
      nextVideo.play().then(() => {
        console.log('🎬 Next video started playing');
        
        // Start crossfade
        currentVideo.style.transition = `opacity ${crossfadeDuration}s ease-out`;
        currentVideo.style.opacity = '0';
        
        // After crossfade completes
        setTimeout(() => {
          console.log('✅ Transition complete');
          
          // Switch active video and update index
          setActiveVideo(prev => prev === 'video1' ? 'video2' : 'video1');
          setCurrentVideoIndex(nextIndex);
          setIsTransitioning(false);
          
          // Reset current video for next transition
          currentVideo.style.transition = '';
          currentVideo.style.opacity = '1';
        }, crossfadeDuration * 1000);
      }).catch((error) => {
        console.error('❌ Failed to play next video:', error);
        setIsTransitioning(false);
      });
    };
    
    // Add event listener after a short delay to ensure src is set
    setTimeout(() => {
      if (nextVideo.src) {
        nextVideo.addEventListener('canplay', handleCanPlay);
      }
    }, 100);
  }, [isTransitioning, isPreloading, getNextVideoIndex, crossfadeDuration, activeVideo]);

  // Handle video events
  useEffect(() => {
    const currentVideo = activeVideo === 'video1' ? video1Ref.current : video2Ref.current;
    if (!currentVideo || isPreloading) return;
    
    const handleTimeUpdate = () => {
      if (videoDuration === 0) {
        // For complete videos, start transition when near the end
        const timeUntilEnd = currentVideo.duration - currentVideo.currentTime;
        const transitionBuffer = crossfadeDuration + 0.5; // 500ms buffer
        if (timeUntilEnd <= transitionBuffer && !isTransitioning) {
          console.log('⏰ Video near end, starting transition');
          startTransition();
        }
      } else {
        // For timed videos, start transition when time is up
        if (currentVideo.currentTime >= videoDuration && !isTransitioning) {
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
    
    currentVideo.addEventListener('timeupdate', handleTimeUpdate);
    currentVideo.addEventListener('ended', handleEnded);
    currentVideo.addEventListener('error', handleError);
    
    return () => {
      currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
      currentVideo.removeEventListener('ended', handleEnded);
      currentVideo.removeEventListener('error', handleError);
    };
  }, [activeVideo, isPreloading, videoDuration, crossfadeDuration, isTransitioning, startTransition]);

  return (
    <div className="relative h-full w-full">
      {/* Loading screen - shown during preload */}
      {isPreloading && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 flex items-center justify-center">
          <div className="text-white text-lg">Loading videos...</div>
        </div>
      )}
      
      {/* Video 1 */}
      <video
        ref={video1Ref}
        key={`video1-${video1Src}`}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        autoPlay
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
        src={video1Src}
      />
      
      {/* Video 2 */}
      <video
        ref={video2Ref}
        key={`video2-${video2Src}`}
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
        src={video2Src}
      />
    </div>
  );
}