'use client';

import { useStream } from '@/lib/hooks/useStream';
import { useVideoPlayer } from '@/lib/hooks/useVideoPlayer';
import { Loading } from '@/components/ui/Loading';
import { cn } from '@/lib/utils/cn';

interface VideoPlayerProps {
  matchId: string;
}

export function VideoPlayer({ matchId }: VideoPlayerProps) {
  const { streamUrl, streamType, isLoading, isError, refetch } = useStream(matchId);
  
  const {
    videoRef,
    isPlaying,
    isMuted,
    error: playerError,
    togglePlayPause,
    toggleMute,
    toggleFullscreen,
    reload,
  } = useVideoPlayer({
    streamUrl,
    streamType,
    autoPlay: true,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full bg-black aspect-video">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loading message="Checking for stream..." />
        </div>
      </div>
    );
  }

  // No stream available
  if (!streamUrl || isError) {
    return (
      <div className="relative w-full bg-black aspect-video">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
          <div className="text-5xl mb-4 opacity-50">📺</div>
          <h3 className="text-lg font-bold mb-2">Stream Not Available</h3>
          <p className="text-sm text-gray-400 mb-4">
            No streaming link has been set for this match yet.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              🔄 Check Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black group">
      {/* Video Element */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          controls={false}
        />

        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <span className="px-3 py-1.5 bg-red-500/95 text-white rounded-full text-[12px] font-bold backdrop-blur-sm shadow-lg animate-pulse-slow">
            🔴 LIVE
          </span>
          <span className="px-3 py-1.5 bg-black/70 text-white rounded-full text-[12px] font-bold backdrop-blur-sm shadow-lg">
            {streamType.toUpperCase()}
          </span>
        </div>

        {/* Error Message */}
        {playerError && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            {playerError}
          </div>
        )}
      </div>

      {/* Custom Controls */}
      <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button
              onClick={toggleMute}
              className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={reload}
              className="px-3 py-1.5 flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors text-white text-sm font-semibold"
            >
              🔄 Reload
            </button>
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
            >
              ⛶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}