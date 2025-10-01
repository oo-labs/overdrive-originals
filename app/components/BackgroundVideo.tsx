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
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState<'video1' | 'video2'>('video1');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [video1Src, setVideo1Src] = useState<string>('');
  const [video2Src, setVideo2Src] = useState<string>('');

  // Generate playlist: 5x the number of available videos
  const generatePlaylist = useCallback(() => {
    const newPlaylist: string[] = [];
    for (let i = 0; i < availableVideos.length * 5; i++) {
      const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
      newPlaylist.push(randomVideo);
    }
    return newPlaylist;
  }, []);

  // Initialize playlist
  useEffect(() => {
    const newPlaylist = generatePlaylist();
    setPlaylist(newPlaylist);
    if (newPlaylist.length > 0) {
      setVideo1Src(`/bg/${newPlaylist[0]}`);
    }
    console.log('🎬 Playlist generated:', newPlaylist.length, 'videos');
  }, [generatePlaylist]);

  // Get next video from playlist
  const getNextVideo = useCallback(() => {
    const nextIndex = (currentVideoIndex + 1) % playlist.length;
    return playlist[nextIndex];
  }, [currentVideoIndex, playlist]);

  // Start transition to next video
  const startTransition = useCallback(() => {
    if (isTransitioning || !playlist.length) return;
    
    const nextVideoSrc = getNextVideo();
    console.log('🔄 Starting transition to:', nextVideoSrc);
    
    setIsTransitioning(true);
    
    // Get current and next video elements
    const currentVideo = activeVideo === 'video1' ? video1Ref.current : video2Ref.current;
    const nextVideo = activeVideo === 'video1' ? video2Ref.current : video1Ref.current;
    
    if (!currentVideo || !nextVideo) return;
    
    // Set next video source and start playing
    const nextVideoPath = `/bg/${nextVideoSrc}`;
    if (activeVideo === 'video1') {
      setVideo2Src(nextVideoPath);
    } else {
      setVideo1Src(nextVideoPath);
    }
    nextVideo.src = nextVideoPath;
    nextVideo.currentTime = 0;
    
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
          
          // Switch active video
          setActiveVideo(prev => prev === 'video1' ? 'video2' : 'video1');
          setCurrentVideoIndex(prev => (prev + 1) % playlist.length);
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
    
    nextVideo.addEventListener('canplay', handleCanPlay);
  }, [isTransitioning, getNextVideo, crossfadeDuration, playlist.length, activeVideo]);

  // Handle video events
  useEffect(() => {
    const currentVideo = activeVideo === 'video1' ? video1Ref.current : video2Ref.current;
    if (!currentVideo || !playlist.length) return;
    
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
  }, [activeVideo, playlist.length, videoDuration, crossfadeDuration, isTransitioning, startTransition]);

  return (
    <div className="relative h-full w-full">
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