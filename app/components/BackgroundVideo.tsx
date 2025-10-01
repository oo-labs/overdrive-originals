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
  
  // Video playlist management
  const playlistRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);

  // Available videos (you can add more as needed)
  const availableVideos = ['bg_01.mp4', 'bg_02.mp4', 'bg_03.mp4', 'bg_04.mp4', 'bg_05.mp4'];

  // Generate a 25-slot playlist (5x the number of available videos)
  const generatePlaylist = () => {
    const newPlaylist: string[] = [];
    for (let i = 0; i < 25; i++) {
      const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      newPlaylist.push(randomVideo);
    }
    return newPlaylist;
  };

  // Get next video from playlist
  const getNextVideoFromPlaylist = () => {
    const nextIndex = (currentIndexRef.current + 1) % playlistRef.current.length;
    return playlistRef.current[nextIndex];
  };

  // Start crossfade from video end
  const startCrossfadeFromEnd = () => {
    if (isCrossfading || !currentVideoRef.current || !nextVideoRef.current) {
      return;
    }
    
    const currentVideoElement = currentVideoRef.current;
    const nextVideoElement = nextVideoRef.current;
    const nextVideoSrc = nextVideoElement.src;
    const nextVideoName = nextVideoSrc.split('/').pop() || '';
    
    if (!nextVideoName) {
      return;
    }
    
    // Simple check - if video can play, start crossfade
    if (nextVideoElement.readyState >= 2) { // HAVE_CURRENT_DATA or higher
      setIsCrossfading(true);
      
      // Start the next video playing
      nextVideoElement.currentTime = 0;
      nextVideoElement.play().catch(console.error);
      
      // Set up crossfade transitions
      currentVideoElement.style.transition = `opacity ${crossfadeDuration}s ease-in-out`;
      nextVideoElement.style.transition = `opacity ${crossfadeDuration}s ease-in-out`;
      
      // Start fade out of current video and fade in of next video
      currentVideoElement.style.opacity = '0';
      nextVideoElement.style.opacity = '1';
    }
    
    // After crossfade completes, switch to next video
    crossfadeTimeoutRef.current = setTimeout(() => {
      // Update playlist index
      currentIndexRef.current = (currentIndexRef.current + 1) % playlistRef.current.length;
      
      // The next video is now the current video
      setCurrentVideo(nextVideoName);
      
      // Get the next video from playlist
      const nextNextVideo = getNextVideoFromPlaylist();
      setNextVideo(nextNextVideo);
      
      setIsCrossfading(false);
      crossfadeTimeoutRef.current = null;
      
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
        video.currentTime = 0;
        video.play().catch(console.error);
        
        // Pre-load the next video from playlist
        const nextVideoName = getNextVideoFromPlaylist();
        setNextVideo(nextVideoName);
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
        // Don't clear crossfade timeout during cleanup - let it complete
        // The crossfade timeout will be cleared when the crossfade actually completes
      };
    }
  }, [currentVideo, videoDuration, crossfadeDuration, isCrossfading]);

  // Handle next video loading
  useEffect(() => {
    if (nextVideoRef.current && nextVideo && !isCrossfading) {
      const video = nextVideoRef.current;
      
      const handleLoadedData = () => {
        video.style.opacity = '0.5';
      };

      video.addEventListener('loadeddata', handleLoadedData);
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [nextVideo, isCrossfading]);

  // Initialize playlist and first video
  useEffect(() => {
    const newPlaylist = generatePlaylist();
    playlistRef.current = newPlaylist;
    
    const firstVideo = newPlaylist[0];
    setCurrentVideo(firstVideo);
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
          preload="metadata"
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
        preload="metadata"
        poster="/bg-poster.jpg"
        src={`/bg/${currentVideo}`}
      />
    </div>
  );
}
