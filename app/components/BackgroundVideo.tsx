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
    const nextVideo = playlistRef.current[nextIndex];
    console.log('🎵 Getting next video - current index:', currentIndexRef.current, 'next index:', nextIndex, 'next video:', nextVideo);
    return nextVideo;
  };

  // Start crossfade from video end
  const startCrossfadeFromEnd = () => {
    console.log('🔄 Crossfade attempt - isCrossfading:', isCrossfading, 'currentVideo:', !!currentVideoRef.current, 'nextVideo:', !!nextVideoRef.current);
    
    if (isCrossfading || !currentVideoRef.current || !nextVideoRef.current) {
      console.log('🔄 Crossfade blocked');
      return;
    }
    
    const currentVideoElement = currentVideoRef.current;
    const nextVideoElement = nextVideoRef.current;
    const nextVideoSrc = nextVideoElement.src;
    const nextVideoName = nextVideoSrc.split('/').pop() || '';
    
    console.log('🔄 Next video name:', nextVideoName, 'readyState:', nextVideoElement.readyState);
    
    if (!nextVideoName) {
      console.log('🔄 No next video name found');
      return;
    }
    
    // Wait for next video to be fully ready
    if (nextVideoElement.readyState >= 4) { // HAVE_ENOUGH_DATA
      console.log('🔄 Starting crossfade');
      setIsCrossfading(true);
      
      // Start the next video playing
      nextVideoElement.currentTime = 0;
      nextVideoElement.play().catch(console.error);
      
      // Set up crossfade transitions with GPU acceleration
      currentVideoElement.style.transition = `opacity ${crossfadeDuration}s ease-in-out`;
      nextVideoElement.style.transition = `opacity ${crossfadeDuration}s ease-in-out`;
      
      // Force GPU acceleration
      currentVideoElement.style.willChange = 'opacity';
      nextVideoElement.style.willChange = 'opacity';
      
      // Start fade out of current video and fade in of next video
      currentVideoElement.style.opacity = '0';
      nextVideoElement.style.opacity = '1';
    } else {
      console.log('🔄 Next video not ready, readyState:', nextVideoElement.readyState, 'waiting for canplaythrough');
      // Wait for the video to be ready
      const handleCanPlayThrough = () => {
        nextVideoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
        console.log('🔄 Next video now ready, starting crossfade');
        startCrossfadeFromEnd(); // Retry the crossfade
      };
      nextVideoElement.addEventListener('canplaythrough', handleCanPlayThrough);
      return; // Exit early, will retry when ready
    }
    
    // After crossfade completes, switch to next video
    crossfadeTimeoutRef.current = setTimeout(() => {
      console.log('✅ Crossfade complete, switching to:', nextVideoName);
      
      // Update playlist index
      currentIndexRef.current = (currentIndexRef.current + 1) % playlistRef.current.length;
      console.log('✅ New playlist index:', currentIndexRef.current);
      
      // The next video is now the current video
      setCurrentVideo(nextVideoName);
      
      // Get the next video from playlist
      const nextNextVideo = getNextVideoFromPlaylist();
      console.log('✅ Next video after switch:', nextNextVideo);
      setNextVideo(nextNextVideo);
      
      setIsCrossfading(false);
      crossfadeTimeoutRef.current = null;
      
      // Reset styles and clean up GPU acceleration
      if (currentVideoRef.current) {
        currentVideoRef.current.style.opacity = '1';
        currentVideoRef.current.style.transition = '';
        currentVideoRef.current.style.willChange = 'auto';
      }
      if (nextVideoRef.current) {
        nextVideoRef.current.style.opacity = '0';
        nextVideoRef.current.style.transition = '';
        nextVideoRef.current.style.willChange = 'auto';
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
        
        // Pre-load the next video from playlist
        const nextVideoName = getNextVideoFromPlaylist();
        console.log('📹 Setting next video to:', nextVideoName);
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
    console.log('🎯 Next video effect - nextVideo:', nextVideo, 'isCrossfading:', isCrossfading);
    if (nextVideoRef.current && nextVideo && !isCrossfading) {
      const video = nextVideoRef.current;
      console.log('🎯 Setting up next video:', nextVideo);
      
      const handleCanPlayThrough = () => {
        console.log('🎯 Next video fully ready:', nextVideo, 'readyState:', video.readyState);
        video.style.opacity = '0.5';
      };

      const handleLoadedData = () => {
        console.log('🎯 Next video loaded:', nextVideo, 'readyState:', video.readyState);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplaythrough', handleCanPlayThrough);
      
      return () => {
        console.log('🎯 Cleaning up next video:', nextVideo);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
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
          preload="auto"
          style={{ 
            willChange: 'opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
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
        preload="auto"
        poster="/bg-poster.jpg"
        style={{ 
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
        src={`/bg/${currentVideo}`}
      />
    </div>
  );
}
