'use client';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/services/api.service';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { getInitials } from '@/lib/utils/format.util';

export default function LeaguesPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['leagues'],
    queryFn: () => apiService.fetchLeagues(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  if (isLoading) {
    return <Loading message="Loading leagues..." fullScreen />;
  }

  if (isError || !data?.popular) {
    return (
      <EmptyState
        icon="🏆"
        title="Failed to load leagues"
        message="Please check your internet connection and try again."
        action={
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="p-4 pb-24">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
        <span>🏆</span> Popular Leagues
      </h2>

      <div className="grid gap-3">
        {data.popular.slice(0, 20).map((league: any) => (
          <button
            key={league.id}
            onClick={() => alert(`League ${league.id} - Feature coming soon!`)}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-border hover:shadow-md transition-all active:scale-98"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
              {getInitials(league.name)}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-bold text-base text-gray-900 truncate">{league.name}</div>
              <div className="text-sm text-gray-500">{league.ccode || 'International'}</div>
            </div>
            <div className="text-gray-400">›</div>
          </button>
        ))}
      </div>
    </div>
  );
}