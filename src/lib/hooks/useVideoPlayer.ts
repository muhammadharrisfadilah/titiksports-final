import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface UseVideoPlayerOptions {
  streamUrl: string | null | undefined;
  streamType: 'hls' | 'flv' | 'mp4' | 'unknown';
  autoPlay?: boolean;
}

export function useVideoPlayer({ streamUrl, streamType, autoPlay = true }: UseVideoPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize player
  useEffect(() => {
    if (!videoRef.current || !streamUrl) return;

    const video = videoRef.current;

    // Cleanup previous player
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Initialize based on stream type
    if (streamType === 'hls') {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            video.play().catch(err => {
              console.log('Auto-play prevented:', err);
              setError('Click play to start');
            });
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setError('Failed to load stream');
            console.error('HLS error:', data);
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = streamUrl;
        if (autoPlay) {
          video.play().catch(err => {
            console.log('Auto-play prevented:', err);
          });
        }
      }
    } else if (streamType === 'mp4') {
      video.src = streamUrl;
      if (autoPlay) {
        video.play().catch(err => {
          console.log('Auto-play prevented:', err);
        });
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl, streamType, autoPlay]);

  // Event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Controls
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const reload = () => {
    if (!videoRef.current) return;
    
    videoRef.current.load();
    videoRef.current.play().catch(err => {
      console.log('Play error:', err);
    });
  };

  return {
    videoRef,
    isPlaying,
    isMuted,
    error,
    togglePlayPause,
    toggleMute,
    toggleFullscreen,
    reload,
  };
}