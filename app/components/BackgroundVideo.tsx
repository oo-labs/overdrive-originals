'use client';

import { useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  videoDuration: number;
}

export default function BackgroundVideo({ videoDuration }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState<string>('bg_01.mp4');
  const [playedVideos, setPlayedVideos] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Available videos (you can add more as needed)
  const availableVideos = ['bg_01.mp4', 'bg_02.mp4', 'bg_03.mp4', 'bg_04.mp4', 'bg_05.mp4'];

  // Get next video to play
  const getNextVideo = () => {
    const remaining = availableVideos.filter(video => !playedVideos.includes(video));
    
    if (remaining.length === 0) {
      // All videos played, reset and start fresh
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

  // Switch to next video
  const switchToNextVideo = () => {
    const nextVideo = getNextVideo();
    setCurrentVideo(nextVideo);
  };

  // Handle video load and play
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        video.currentTime = 0;
        video.play().catch(console.error);
        
        // Set timeout to switch video after specified duration
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          switchToNextVideo();
        }, videoDuration * 1000);
      };

      const handleError = (e: Event) => {
        console.error('Video error:', e);
        // Try next video on error
        switchToNextVideo();
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [currentVideo, videoDuration]);

  // Initialize with first video
  useEffect(() => {
    if (playedVideos.length === 0) {
      const firstVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      setPlayedVideos([firstVideo]);
      setCurrentVideo(firstVideo);
    }
  }, []);

  return (
    <video
      ref={videoRef}
      key={currentVideo} // Force re-render when video changes
      className="h-full w-full object-cover"
      muted
      playsInline
      autoPlay
      loop={false}
      onError={(e) => console.error('Video error:', e)}
      poster="/bg-poster.jpg"
      src={`/bg/${currentVideo}`}
    />
  );
}
