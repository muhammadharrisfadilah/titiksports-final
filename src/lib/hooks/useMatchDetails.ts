import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/services/api.service';

export function useMatchDetails(matchId: string) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['matchDetails', matchId],
    queryFn: () => apiService.fetchMatchDetails(matchId),
    enabled: !!matchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  // Extract different sections
  const header = data?.header;
  const general = data?.general;
  const facts = data?.content?.matchFacts;
  const lineup = data?.content?.lineup;
  const stats = data?.content?.stats;

  return {
    data,
    header,
    general,
    facts,
    lineup,
    stats,
    isLoading,
    isError,
    error,
    refetch,
  };
}