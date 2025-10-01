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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Start crossfade transition
  const startCrossfade = () => {
    if (isCrossfading) return;
    
    const nextVideoName = getNextVideo();
    console.log('Starting crossfade to:', nextVideoName, 'Played so far:', playedVideos);
    
    setIsCrossfading(true);
    setNextVideo(nextVideoName);
    
    // Start the next video
    if (nextVideoRef.current) {
      nextVideoRef.current.currentTime = 0;
      nextVideoRef.current.play().catch(console.error);
    }
    
    // Start crossfade animation
    if (currentVideoRef.current && nextVideoRef.current) {
      const currentVideo = currentVideoRef.current;
      const nextVideo = nextVideoRef.current;
      
      // Fade out current video and fade in next video
      currentVideo.style.transition = `opacity ${crossfadeDuration}s ease-in-out`;
      nextVideo.style.transition = `opacity ${crossfadeDuration}s ease-in-out`;
      
      currentVideo.style.opacity = '0';
      nextVideo.style.opacity = '1';
      
      // After crossfade completes, switch videos
      crossfadeTimeoutRef.current = setTimeout(() => {
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
    }
  };

  // Handle video timing
  useEffect(() => {
    if (currentVideoRef.current && !isCrossfading) {
      const video = currentVideoRef.current;
      
      const handleLoadedData = () => {
        video.currentTime = 0;
        video.play().catch(console.error);
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        if (videoDuration === 0) {
          // Play complete video
          console.log('Playing complete video:', currentVideo);
          // No timeout needed - will use onEnded event
        } else {
          // Play for specified duration
          console.log('Playing video for', videoDuration, 'seconds:', currentVideo);
          timeoutRef.current = setTimeout(() => {
            startCrossfade();
          }, videoDuration * 1000);
        }
      };

      const handleEnded = () => {
        if (videoDuration === 0) {
          // Video ended naturally, start crossfade
          console.log('Video ended naturally, starting crossfade');
          startCrossfade();
        }
      };

      const handleError = (e: Event) => {
        console.error('Video error:', e);
        startCrossfade();
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('error', handleError);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (crossfadeTimeoutRef.current) {
          clearTimeout(crossfadeTimeoutRef.current);
        }
      };
    }
  }, [currentVideo, videoDuration, crossfadeDuration, isCrossfading]);

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
      {/* Current video */}
      <video
        ref={currentVideoRef}
        key={currentVideo}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        autoPlay
        loop={false}
        poster="/bg-poster.jpg"
        src={`/bg/${currentVideo}`}
      />
      
      {/* Next video (for crossfading) */}
      {isCrossfading && nextVideo && (
        <video
          ref={nextVideoRef}
          key={nextVideo}
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          muted
          playsInline
          loop={false}
          src={`/bg/${nextVideo}`}
        />
      )}
    </div>
  );
}
