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
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
    console.log('🎵 Generated new playlist:', newPlaylist);
    return newPlaylist;
  };

  // Get next video from playlist
  const getNextVideoFromPlaylist = () => {
    const nextIndex = (currentIndexRef.current + 1) % playlistRef.current.length;
    const nextVideo = playlistRef.current[nextIndex];
    console.log('🎵 Getting next video from playlist. Current index:', currentIndexRef.current, 'Next index:', nextIndex, 'Next video:', nextVideo);
    return nextVideo;
  };

  // Get video at specific index from playlist
  const getVideoAtIndex = (index: number) => {
    const video = playlistRef.current[index];
    console.log('🎵 Getting video at index:', index, 'Video:', video);
    return video;
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
    
    // Get the next video name from the DOM element src instead of state
    const currentVideoElement = currentVideoRef.current;
    const nextVideoElement = nextVideoRef.current;
    const nextVideoSrc = nextVideoElement.src;
    const nextVideoName = nextVideoSrc.split('/').pop() || '';
    
    console.log('🔄 Starting crossfade from video end, duration:', crossfadeDuration);
    console.log('🔄 Current video element:', currentVideoElement.src);
    console.log('🔄 Next video element:', nextVideoElement.src);
    console.log('🔄 Next video name from src:', nextVideoName);
    
    if (!nextVideoName) {
      console.log('🔄 Crossfade blocked - no next video name found');
      return;
    }
    
    // Check if next video is fully loaded and ready
    console.log('🔄 Checking next video readiness. readyState:', nextVideoElement.readyState);
    console.log('🔄 NetworkState:', nextVideoElement.networkState);
    console.log('🔄 Buffered ranges:', nextVideoElement.buffered.length);
    
    if (nextVideoElement.readyState < 4) { // HAVE_ENOUGH_DATA
      console.log('🔄 Next video not ready (readyState < 4), waiting for canplaythrough event');
      const handleCanPlayThrough = () => {
        nextVideoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
        console.log('🔄 Next video ready (canplaythrough), starting crossfade');
        performCrossfade();
      };
      nextVideoElement.addEventListener('canplaythrough', handleCanPlayThrough);
      return;
    }
    
    performCrossfade();
    
    function performCrossfade() {
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
    }
    
    // After crossfade completes, switch to next video
    crossfadeTimeoutRef.current = setTimeout(() => {
      console.log('✅ Crossfade complete, switching videos. Current:', nextVideoName);
      console.log('✅ Setting currentVideo to:', nextVideoName);
      
      // Update playlist index
      currentIndexRef.current = (currentIndexRef.current + 1) % playlistRef.current.length;
      setCurrentIndex(currentIndexRef.current);
      
      // The next video is now the current video
      setCurrentVideo(nextVideoName);
      
      // Get the next video from playlist
      console.log('✅ Getting next video from playlist...');
      const nextNextVideo = getNextVideoFromPlaylist();
      console.log('✅ Setting nextVideo to:', nextNextVideo);
      setNextVideo(nextNextVideo);
      
      setIsCrossfading(false);
      console.log('✅ Crossfade complete, isCrossfading set to false');
      
      // Clear the timeout reference
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
        console.log('📹 Current video loaded:', currentVideo);
        console.log('📹 Video readyState:', video.readyState, 'NetworkState:', video.networkState);
        console.log('📹 Video duration:', video.duration);
        video.currentTime = 0;
        video.play().catch(console.error);
        
        // Pre-load the next video from playlist
        console.log('📹 Getting next video from playlist for current:', currentVideo);
        const nextVideoName = getNextVideoFromPlaylist();
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
        // Don't clear crossfade timeout during cleanup - let it complete
        // The crossfade timeout will be cleared when the crossfade actually completes
      };
    }
  }, [currentVideo, videoDuration, crossfadeDuration, isCrossfading]);

  // Handle next video loading with comprehensive debugging
  useEffect(() => {
    console.log('🎯 Next video effect triggered. nextVideo:', nextVideo, 'isCrossfading:', isCrossfading);
    if (nextVideoRef.current && nextVideo && !isCrossfading) {
      const video = nextVideoRef.current;
      console.log('🎯 Next video element found, setting up event listener for:', nextVideo);
      console.log('🎯 Video readyState:', video.readyState, 'NetworkState:', video.networkState);
      console.log('🎯 Video src:', video.src);
      
      const handleLoadedData = () => {
        console.log('🎯 loadeddata event fired for:', nextVideo);
        console.log('🎯 Video readyState after loadeddata:', video.readyState);
        video.style.opacity = '0.5';
        console.log('🎯 Next video loaded and ready:', nextVideo);
      };

      const handleCanPlay = () => {
        console.log('🎯 canplay event fired for:', nextVideo);
        console.log('🎯 Video readyState after canplay:', video.readyState);
      };

      const handleCanPlayThrough = () => {
        console.log('🎯 canplaythrough event fired for:', nextVideo);
        console.log('🎯 Video readyState after canplaythrough:', video.readyState);
      };

      const handleLoadStart = () => {
        console.log('🎯 loadstart event fired for:', nextVideo);
      };

      const handleProgress = () => {
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const duration = video.duration;
          const percentBuffered = (bufferedEnd / duration) * 100;
          console.log('🎯 Progress for', nextVideo, ':', percentBuffered.toFixed(1) + '% buffered');
        }
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('canplaythrough', handleCanPlayThrough);
      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('progress', handleProgress);
      
      return () => {
        console.log('🎯 Cleaning up next video event listeners for:', nextVideo);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('progress', handleProgress);
      };
    }
  }, [nextVideo, isCrossfading]);

  // Initialize playlist and first video
  useEffect(() => {
    const newPlaylist = generatePlaylist();
    setPlaylist(newPlaylist);
    playlistRef.current = newPlaylist;
    
    const firstVideo = newPlaylist[0];
    console.log('🚀 Initializing with first video from playlist:', firstVideo);
    setCurrentVideo(firstVideo);
    console.log('🚀 Initialized with video:', firstVideo, 'Playlist length:', newPlaylist.length);
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
