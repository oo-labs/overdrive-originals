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
  const [playedVideos, setPlayedVideos] = useState<string[]>([]);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Available videos (you can add more as needed)
  const availableVideos = ['bg_01.mp4', 'bg_02.mp4', 'bg_03.mp4', 'bg_04.mp4', 'bg_05.mp4'];

  // Get next video to play
  const getNextVideo = () => {
    const remaining = availableVideos.filter(video => !playedVideos.includes(video));
    
    if (remaining.length === 0) {
      // All videos played, reset and start fresh with new random order
      setPlayedVideos([]);
      const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      setPlayedVideos([randomVideo]);
      return randomVideo;
    } else {
      // Pick randomly from remaining videos
      const randomVideo = remaining[Math.floor(Math.random() * remaining.length)];
      setPlayedVideos(prev => [...prev, randomVideo]);
      return randomVideo;
    }
  };

  // Start crossfade from video end
  const startCrossfadeFromEnd = () => {
    if (isCrossfading || !currentVideoRef.current || !nextVideoRef.current) return;
    
    const currentVideo = currentVideoRef.current;
    const nextVideo = nextVideoRef.current;
    
    console.log('Starting crossfade from video end, duration:', crossfadeDuration);
    
    setIsCrossfading(true);
    
    // Set up crossfade transitions
    currentVideo.style.transition = `opacity ${crossfadeDuration}s ease-in-out`;
    nextVideo.style.transition = `opacity ${crossfadeDuration}s ease-in-out`;
    
    // Start fade out of current video and fade in of next video
    currentVideo.style.opacity = '0';
    nextVideo.style.opacity = '1';
    
    // After crossfade completes, switch to next video
    crossfadeTimeoutRef.current = setTimeout(() => {
      const nextVideoName = getNextVideo();
      console.log('Crossfade complete, switching to:', nextVideoName);
      
      setCurrentVideo(nextVideoName);
      setNextVideo('');
      setIsCrossfading(false);
      
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
        
        // Pre-load the next video
        const nextVideoName = getNextVideo();
        setNextVideo(nextVideoName);
        console.log('Current video loaded:', currentVideo, 'Next video prepared:', nextVideoName);
      };

      const handleTimeUpdate = () => {
        if (videoDuration === 0) {
          // For complete videos, start crossfade when video is near the end
          const timeUntilEnd = video.duration - video.currentTime;
          if (timeUntilEnd <= crossfadeDuration && !isCrossfading) {
            console.log('Video near end, starting crossfade');
            startCrossfadeFromEnd();
          }
        } else {
          // For timed videos, start crossfade when time is up
          if (video.currentTime >= videoDuration && !isCrossfading) {
            console.log('Video duration reached, starting crossfade');
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
    if (nextVideoRef.current && nextVideo && !isCrossfading) {
      const video = nextVideoRef.current;
      
      const handleLoadedData = () => {
        // Next video is ready, set it to 50% opacity and prepare for crossfade
        video.style.opacity = '0.5';
        console.log('Next video loaded and ready:', nextVideo);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [nextVideo, isCrossfading]);

  // Initialize with first video
  useEffect(() => {
    if (playedVideos.length === 0) {
      const firstVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      setPlayedVideos([firstVideo]);
      setCurrentVideo(firstVideo);
    }
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
