/**
 * Video Preloader - Manages multiple video elements in memory for seamless transitions
 */

export interface VideoPreloaderOptions {
  maxPreloadedVideos: number;
  preloadDistance: number; // How many videos ahead to preload
}

export class VideoPreloader {
  private videoElements: Map<string, HTMLVideoElement> = new Map();
  private loadingPromises: Map<string, Promise<void>> = new Map();
  private options: VideoPreloaderOptions;
  private basePath: string;

  constructor(basePath: string = '/bg/', options: Partial<VideoPreloaderOptions> = {}) {
    this.basePath = basePath;
    this.options = {
      maxPreloadedVideos: 3,
      preloadDistance: 2,
      ...options
    };
  }

  /**
   * Create a video element with optimized settings
   */
  private createVideoElement(filename: string): HTMLVideoElement {
    const video = document.createElement('video');
    video.src = `${this.basePath}${filename}`;
    video.muted = true;
    video.playsInline = true;
    video.loop = false;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    
    // Optimize for performance
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.opacity = '0';
    video.style.zIndex = '0';
    video.style.willChange = 'opacity';
    video.style.transform = 'translateZ(0)';
    video.style.backfaceVisibility = 'hidden';
    video.style.isolation = 'isolate';
    
    // Hide from screen readers and accessibility
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');
    
    return video;
  }

  /**
   * Preload a video and return a promise that resolves when ready
   */
  async preloadVideo(filename: string): Promise<HTMLVideoElement> {
    // Return existing video if already loaded
    if (this.videoElements.has(filename)) {
      return this.videoElements.get(filename)!;
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(filename)) {
      await this.loadingPromises.get(filename);
      return this.videoElements.get(filename)!;
    }

    console.log(`🎬 Preloading video: ${filename}`);

    const video = this.createVideoElement(filename);
    
    // Add to DOM (hidden) to start loading
    document.body.appendChild(video);

    const loadPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Video ${filename} failed to load within 10 seconds`));
      }, 10000);

      const handleCanPlayThrough = () => {
        clearTimeout(timeout);
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('error', handleError);
        console.log(`✅ Video preloaded: ${filename}`);
        resolve();
      };

      const handleError = (e: Event) => {
        clearTimeout(timeout);
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
        video.removeEventListener('error', handleError);
        console.error(`❌ Failed to preload video: ${filename}`, e);
        reject(e);
      };

      video.addEventListener('canplaythrough', handleCanPlayThrough);
      video.addEventListener('error', handleError);
    });

    this.loadingPromises.set(filename, loadPromise);
    
    try {
      await loadPromise;
      this.videoElements.set(filename, video);
      this.loadingPromises.delete(filename);
      return video;
    } catch (error) {
      this.loadingPromises.delete(filename);
      // Clean up failed video
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
      throw error;
    }
  }

  /**
   * Get a preloaded video element
   */
  getVideo(filename: string): HTMLVideoElement | null {
    return this.videoElements.get(filename) || null;
  }

  /**
   * Check if a video is preloaded and ready
   */
  isVideoReady(filename: string): boolean {
    const video = this.videoElements.get(filename);
    return video ? video.readyState >= 4 : false; // HAVE_ENOUGH_DATA
  }

  /**
   * Preload multiple videos in sequence
   */
  async preloadVideos(filenames: string[]): Promise<HTMLVideoElement[]> {
    const results: HTMLVideoElement[] = [];
    
    for (const filename of filenames) {
      try {
        const video = await this.preloadVideo(filename);
        results.push(video);
      } catch (error) {
        console.warn(`Failed to preload ${filename}:`, error);
        // Continue with other videos even if one fails
      }
    }
    
    return results;
  }

  /**
   * Preload videos for a playlist starting from a given index
   */
  async preloadPlaylist(playlist: string[], startIndex: number): Promise<void> {
    const videosToPreload: string[] = [];
    
    // Preload the next few videos in the playlist
    for (let i = 0; i < this.options.preloadDistance; i++) {
      const index = (startIndex + i + 1) % playlist.length;
      const filename = playlist[index];
      
      if (!this.isVideoReady(filename)) {
        videosToPreload.push(filename);
      }
    }

    if (videosToPreload.length > 0) {
      console.log(`🎬 Preloading playlist videos:`, videosToPreload);
      await this.preloadVideos(videosToPreload);
    }
  }

  /**
   * Move a video element to a new container
   */
  moveVideoToContainer(filename: string, container: HTMLElement): HTMLVideoElement | null {
    const video = this.videoElements.get(filename);
    if (!video) return null;

    // Remove from current parent
    if (video.parentNode) {
      video.parentNode.removeChild(video);
    }

    // Add to new container
    container.appendChild(video);
    
    return video;
  }

  /**
   * Clean up old videos to manage memory
   */
  cleanup(maxVideos: number = this.options.maxPreloadedVideos): void {
    const videos = Array.from(this.videoElements.entries());
    
    if (videos.length > maxVideos) {
      // Remove oldest videos (simple FIFO for now)
      const videosToRemove = videos.slice(0, videos.length - maxVideos);
      
      for (const [filename, video] of videosToRemove) {
        console.log(`🧹 Cleaning up video: ${filename}`);
        
        // Stop video and remove from DOM
        video.pause();
        video.currentTime = 0;
        video.src = ''; // Clear src to free memory
        video.load(); // Reset video element
        
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
        
        this.videoElements.delete(filename);
      }
    }
  }

  /**
   * Clean up videos that are no longer needed in the playlist
   */
  cleanupUnusedVideos(currentPlaylist: string[], currentIndex: number): void {
    const videosToKeep = new Set<string>();
    
    // Keep current video and next few videos
    for (let i = 0; i < this.options.preloadDistance + 1; i++) {
      const index = (currentIndex + i) % currentPlaylist.length;
      videosToKeep.add(currentPlaylist[index]);
    }
    
    // Remove videos not in the keep list
    for (const [filename, video] of this.videoElements) {
      if (!videosToKeep.has(filename)) {
        console.log(`🧹 Cleaning up unused video: ${filename}`);
        
        video.pause();
        video.currentTime = 0;
        video.src = '';
        video.load();
        
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
        
        this.videoElements.delete(filename);
      }
    }
  }

  /**
   * Get memory usage info
   */
  getMemoryInfo(): { loadedVideos: number; loadingVideos: number } {
    return {
      loadedVideos: this.videoElements.size,
      loadingVideos: this.loadingPromises.size
    };
  }

  /**
   * Clean up all videos and resources
   */
  destroy(): void {
    console.log('🧹 Destroying video preloader');
    
    // Clean up all videos
    for (const [, video] of this.videoElements) {
      video.pause();
      video.currentTime = 0;
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
    }
    
    this.videoElements.clear();
    this.loadingPromises.clear();
  }
}
