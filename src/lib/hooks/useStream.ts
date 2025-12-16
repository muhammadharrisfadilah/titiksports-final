import { useQuery } from '@tanstack/react-query';
import { supabaseService } from '@/lib/services/supabase.service';

export function useStream(matchId: string) {
  const {
    data: streamUrl,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['stream', matchId],
    queryFn: () => supabaseService.getStreamingLink(matchId),
    enabled: !!matchId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });

  // Detect stream type
  const getStreamType = (url: string | null | undefined): 'hls' | 'flv' | 'mp4' | 'unknown' => {
    if (!url) return 'unknown';
    
    const urlLower = url.toLowerCase();
    if (urlLower.includes('.m3u8')) return 'hls';
    if (urlLower.includes('.flv')) return 'flv';
    if (urlLower.includes('.mp4')) return 'mp4';
    
    return 'unknown';
  };

  return {
    streamUrl,
    streamType: getStreamType(streamUrl),
    isLoading,
    isError,
    error,
    refetch,
  };
}