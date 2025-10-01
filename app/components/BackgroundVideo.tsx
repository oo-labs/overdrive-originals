'use client';

import { useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  videoDuration: number;
}

export default function BackgroundVideo({ videoDuration }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [availableVideos, setAvailableVideos] = useState<string[]>([]);
  const [playedVideos, setPlayedVideos] = useState<string[]>([]);

  // Generate list of available videos (bg_01.mp4, bg_02.mp4, etc.)
  useEffect(() => {
    const videos: string[] = [];
    for (let i = 1; i <= 99; i++) {
      const num = i.toString().padStart(2, '0');
      videos.push(`bg_${num}.mp4`);
    }
    setAvailableVideos(videos);
  }, []);

  // Shuffle array function
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get next video to play
  const getNextVideo = () => {
    if (playedVideos.length === 0) {
      // First time or all videos played, shuffle and start fresh
      const shuffled = shuffleArray(availableVideos);
      setPlayedVideos([shuffled[0]]);
      return shuffled[0];
    } else if (playedVideos.length < availableVideos.length) {
      // Still have unplayed videos, pick randomly from remaining
      const remaining = availableVideos.filter(video => !playedVideos.includes(video));
      const randomVideo = remaining[Math.floor(Math.random() * remaining.length)];
      setPlayedVideos(prev => [...prev, randomVideo]);
      return randomVideo;
    } else {
      // All videos played, reset and shuffle
      const shuffled = shuffleArray(availableVideos);
      setPlayedVideos([shuffled[0]]);
      return shuffled[0];
    }
  };

  // Handle video end and switch to next video
  const handleVideoEnd = () => {
    const nextVideo = getNextVideo();
    if (videoRef.current) {
      videoRef.current.src = `/bg/${nextVideo}`;
      videoRef.current.load();
      videoRef.current.play().catch(console.error);
    }
  };

  // Set initial video
  useEffect(() => {
    if (availableVideos.length > 0 && videoRef.current) {
      const initialVideo = getNextVideo();
      videoRef.current.src = `/bg/${initialVideo}`;
      videoRef.current.load();
      videoRef.current.play().catch(console.error);
    }
  }, [availableVideos]);

  // Set video duration
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          // Let the video play for the specified duration, then switch
          setTimeout(() => {
            handleVideoEnd();
          }, videoDuration * 1000);
        }
      });
    }
  }, [videoDuration]);

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover"
      muted
      playsInline
      onEnded={handleVideoEnd}
      poster="/bg-poster.jpg"
    />
  );
}
