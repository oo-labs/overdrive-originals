'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { VideoPreloader } from './VideoPreloader';

interface BackgroundVideoProps {
  videoDuration: number;
  crossfadeDuration: number;
}

// Available videos (you can add more as needed)
const availableVideos = ['bg_01.mp4', 'bg_02.mp4', 'bg_03.mp4', 'bg_04.mp4', 'bg_05.mp4'];

export default function BackgroundVideo({ videoDuration, crossfadeDuration }: BackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState<string>('bg_01.mp4');
  const [isCrossfading, setIsCrossfading] = useState(false);
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeUpdateRef = useRef<number>(0);
  
  // Video preloader and playlist management
  const preloaderRef = useRef<VideoPreloader | null>(null);
  const playlistRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);

  // Generate a 25-slot playlist (5x the number of available videos)
  const generatePlaylist = useCallback(() => {
    const newPlaylist: string[] = [];
    for (let i = 0; i < 25; i++) {
      const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      newPlaylist.push(randomVideo);
    }
    return newPlaylist;
  }, []);

  // Get next video from playlist
  const getNextVideoFromPlaylist = () => {
    const nextIndex = (currentIndexRef.current + 1) % playlistRef.current.length;
    const nextVideo = playlistRef.current[nextIndex];
    console.log('🎵 Getting next video - current index:', currentIndexRef.current, 'next index:', nextIndex, 'next video:', nextVideo);
    return nextVideo;
  };

  // Start crossfade using preloaded video
  const startCrossfadeFromEnd = useCallback(async () => {
    console.log('🔄 Crossfade attempt - isCrossfading:', isCrossfading);
    
    if (isCrossfading || !preloaderRef.current || !containerRef.current) {
      console.log('🔄 Crossfade blocked');
      return;
    }
    
    const preloader = preloaderRef.current;
    const nextVideoName = getNextVideoFromPlaylist();
    
    console.log('🔄 Next video name:', nextVideoName);
    
    if (!nextVideoName) {
      console.log('🔄 No next video name found');
      return;
    }
    
    // Get preloaded video
    const nextVideoElement = preloader.getVideo(nextVideoName);
    
    if (!nextVideoElement) {
      console.log('🔄 Next video not preloaded, preloading now...');
      try {
        await preloader.preloadVideo(nextVideoName);
        const loadedVideo = preloader.getVideo(nextVideoName);
        if (loadedVideo) {
          // Move to container
          preloader.moveVideoToContainer(nextVideoName, containerRef.current);
          nextVideoRef.current = loadedVideo;
        } else {
          console.error('🔄 Failed to get preloaded video');
          return;
        }
      } catch (error) {
        console.error('🔄 Failed to preload next video:', error);
        return;
      }
    } else {
      // Move preloaded video to container
      preloader.moveVideoToContainer(nextVideoName, containerRef.current);
      nextVideoRef.current = nextVideoElement;
    }
    
    if (!nextVideoRef.current || !currentVideoRef.current) {
      console.log('🔄 Video elements not ready');
      return;
    }
    
    console.log('🔄 Starting crossfade with preloaded video');
    setIsCrossfading(true);
    
    // Start the next video playing
    nextVideoRef.current.currentTime = 0;
    nextVideoRef.current.play().catch(console.error);
    
    // Set up crossfade transitions with GPU acceleration
    currentVideoRef.current.style.transition = `opacity ${crossfadeDuration}s cubic-bezier(0.4, 0, 0.2, 1)`;
    nextVideoRef.current.style.transition = `opacity ${crossfadeDuration}s cubic-bezier(0.4, 0, 0.2, 1)`;
    
    // Force GPU acceleration
    currentVideoRef.current.style.willChange = 'opacity';
    nextVideoRef.current.style.willChange = 'opacity';
    
    // Use requestAnimationFrame to ensure smooth transition start
    requestAnimationFrame(() => {
      // Start fade out of current video and fade in of next video
      currentVideoRef.current!.style.opacity = '0';
      nextVideoRef.current!.style.opacity = '1';
    });
    
    // After crossfade completes, switch to next video
    crossfadeTimeoutRef.current = setTimeout(() => {
      console.log('✅ Crossfade complete, switching to:', nextVideoName);
      
      // Update playlist index
      currentIndexRef.current = (currentIndexRef.current + 1) % playlistRef.current.length;
      console.log('✅ New playlist index:', currentIndexRef.current);
      
      // The next video is now the current video - swap the refs instead of re-rendering
      if (nextVideoRef.current) {
        // Make the next video the current video by updating its styles
        nextVideoRef.current.style.opacity = '1';
        nextVideoRef.current.style.transition = '';
        nextVideoRef.current.style.willChange = 'auto';
        nextVideoRef.current.style.zIndex = '10';
        
        // Update the current video ref to point to the next video
        currentVideoRef.current = nextVideoRef.current;
        nextVideoRef.current = null;
      }
      
      // Update the state to reflect the new current video (but don't re-render the video element)
      setCurrentVideo(nextVideoName);
      
      // Clean up unused videos and preload next videos in the background
      preloader.cleanupUnusedVideos(playlistRef.current, currentIndexRef.current);
      preloader.preloadPlaylist(playlistRef.current, currentIndexRef.current).catch(console.error);
      
      setIsCrossfading(false);
      crossfadeTimeoutRef.current = null;
    }, crossfadeDuration * 1000);
  }, [crossfadeDuration, isCrossfading]);

  // Handle current video events
  useEffect(() => {
    if (currentVideoRef.current && !isCrossfading && preloaderRef.current) {
      const video = currentVideoRef.current;
      const preloader = preloaderRef.current;
      
      const handleLoadedData = () => {
        console.log('📹 Current video loaded:', currentVideo);
        video.currentTime = 0;
        video.play().catch(console.error);
        
        // Preload next videos in the background
        preloader.preloadPlaylist(playlistRef.current, currentIndexRef.current).catch(console.error);
      };

      const handleTimeUpdate = () => {
        // Throttle time update checks to reduce performance impact
        const now = Date.now();
        if (now - lastTimeUpdateRef.current < 100) { // Check every 100ms max
          return;
        }
        lastTimeUpdateRef.current = now;
        
        if (videoDuration === 0) {
          // For complete videos, start crossfade when video is near the end
          // Add buffer to ensure crossfade completes before video ends
          const timeUntilEnd = video.duration - video.currentTime;
          const crossfadeBuffer = crossfadeDuration + 0.2; // Add 200ms buffer
          if (timeUntilEnd <= crossfadeBuffer && !isCrossfading) {
            console.log('⏰ Video near end, starting crossfade. Time until end:', timeUntilEnd, 'Crossfade duration:', crossfadeDuration, 'Buffer:', crossfadeBuffer);
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
        // Don't clear crossfade timeout during cleanup - let it complete
        // The crossfade timeout will be cleared when the crossfade actually completes
      };
    }
  }, [currentVideo, videoDuration, crossfadeDuration, isCrossfading, startCrossfadeFromEnd]);

  // Initialize preloader
  useEffect(() => {
    if (!preloaderRef.current) {
      preloaderRef.current = new VideoPreloader('/bg/', {
        maxPreloadedVideos: 3,
        preloadDistance: 2
      });
      
      console.log('🎬 Video preloader initialized');
      
      // Set up periodic cleanup
      const cleanupInterval = setInterval(() => {
        if (preloaderRef.current) {
          preloaderRef.current.cleanup();
          const memoryInfo = preloaderRef.current.getMemoryInfo();
          console.log('🧹 Memory cleanup - loaded:', memoryInfo.loadedVideos, 'loading:', memoryInfo.loadingVideos);
        }
      }, 30000); // Clean up every 30 seconds
      
      return () => {
        clearInterval(cleanupInterval);
        // Clean up preloader on unmount
        if (preloaderRef.current) {
          preloaderRef.current.destroy();
          preloaderRef.current = null;
        }
      };
    }
  }, []);

  // Initialize playlist and first video
  useEffect(() => {
    if (preloaderRef.current) {
      const newPlaylist = generatePlaylist();
      playlistRef.current = newPlaylist;
      
      const firstVideo = newPlaylist[0];
      setCurrentVideo(firstVideo);
      
      // Preload the first few videos
      preloaderRef.current.preloadPlaylist(newPlaylist, 0).catch(console.error);
    }
  }, [generatePlaylist]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Current video (on top) - only render initially, then manage via preloader */}
      {!isCrossfading && (
        <video
          ref={currentVideoRef}
          key={currentVideo}
          className="absolute inset-0 h-full w-full object-cover z-10"
          muted
          playsInline
          autoPlay
          loop={false}
          preload="auto"
          crossOrigin="anonymous"
          poster="/bg-poster.jpg"
          style={{ 
            willChange: 'opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            isolation: 'isolate'
          } as React.CSSProperties}
          src={`/bg/${currentVideo}`}
        />
      )}
    </div>
  );
}
