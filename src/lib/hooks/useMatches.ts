import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/services/api.service';
import { MatchesResponse } from '@/types/match.types';
import { format } from 'date-fns';

interface UseMatchesOptions {
  date: Date;
  enabled?: boolean;
}

export function useMatches({ date, enabled = true }: UseMatchesOptions) {
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Background refresh untuk live matches
  const backgroundRefresh = () => {
    if (data?.leagues) {
      const hasLiveMatches = data.leagues.some((league) =>
        league.matches?.some((match) => 
          match.status?.started && !match.status?.finished
        )
      );

      if (hasLiveMatches) {
        queryClient.invalidateQueries({ queryKey: ['matches', dateKey] });
      }
    }
  };

  // Prefetch next/prev day
  const prefetchAdjacentDays = () => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);

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