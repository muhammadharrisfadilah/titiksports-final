import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/services/api.service';
import { MatchesResponse } from '@/types/match.types';
import { format } from 'date-fns';

interface UseMatchesOptions {
  date: Date;
  enabled?: boolean;
  initialData?: MatchesResponse | null;
}

export function useMatches({ date, enabled = true, initialData }: UseMatchesOptions) {
  const queryClient = useQueryClient();
  const dateKey = format(date, 'yyyyMMdd');

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['matches', dateKey],
    queryFn: () => apiService.fetchMatches(date),
    enabled,
    // ✅ Use initial data dari ISR/SSG
    initialData: initialData || undefined,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    // ✅ Refetch ONLY if window focused AND data is stale
    refetchOnWindowFocus: true,
    refetchOnMount: false, // Don't refetch if we have initial data
  });

  // ✅ SMART background refresh - only for live matches
  const backgroundRefresh = () => {
    if (!data?.leagues) return;

    const hasLiveMatches = data.leagues.some((league) =>
      league.matches?.some((match) => 
        match.status?.started && !match.status?.finished
      )
    );

    // ✅ Only invalidate if there are live matches
    if (hasLiveMatches) {
      queryClient.invalidateQueries({ 
        queryKey: ['matches', dateKey],
        refetchType: 'active', // Only refetch if currently viewing
      });
    }
  };

  // ✅ OPTIMIZED prefetch - use lower priority
  const prefetchAdjacentDays = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);

    // ✅ Prefetch with lower priority (won't block current requests)
    setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['matches', format(nextDay, 'yyyyMMdd')],
        queryFn: () => apiService.fetchMatches(nextDay),
        staleTime: 2 * 60 * 1000,
      });

      queryClient.prefetchQuery({
        queryKey: ['matches', format(prevDay, 'yyyyMMdd')],
        queryFn: () => apiService.fetchMatches(prevDay),
        staleTime: 2 * 60 * 1000,
      });
    }, 1000); // Delay 1 second
  };

  return {
    matches: data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    backgroundRefresh,
    prefetchAdjacentDays,
  };
}