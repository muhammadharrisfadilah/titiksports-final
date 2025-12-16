'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { apiService } from '@/lib/services/api.service';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { getTeamLogoUrl } from '@/lib/utils/format.util';
import { cn } from '@/lib/utils/cn';

export default function StandingsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['standings', 47], // Premier League
    queryFn: () => apiService.fetchStandings(47),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return <Loading message="Loading standings..." fullScreen />;
  }

  if (isError || !data?.table?.[0]?.data?.table?.all) {
    return (
      <EmptyState
        icon="📊"
        title="Failed to load standings"
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

  const standings = data.table[0].data.table.all;
  const leagueName = data.details?.name || 'Premier League';

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6">
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <span>📊</span> {leagueName}
        </h2>
        <p className="text-sm opacity-90 mt-1">League Standings</p>
      </div>

      {/* Table Header */}
      <div className="sticky top-[73px] z-40 bg-gray-50 border-b border-border px-4 py-3">
        <div className="flex items-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <div className="w-10 text-center">#</div>
          <div className="flex-1">Team</div>
          <div className="w-12 text-center">MP</div>
          <div className="w-12 text-center">W</div>
          <div className="w-12 text-center">D</div>
          <div className="w-12 text-center">L</div>
          <div className="w-14 text-center font-extrabold">PTS</div>
        </div>
      </div>

      {/* Standings */}
      <div className="bg-white">
        {standings.map((team: any, index: number) => {
          const rankClass = index < 4 
            ? 'text-green-600 font-extrabold' 
            : index >= 17 
            ? 'text-red-600 font-extrabold' 
            : 'text-gray-700 font-bold';

          const bgClass = index < 4
            ? 'bg-green-50'
            : index >= 17
            ? 'bg-red-50'
            : 'bg-white';

          return (
            <div
              key={team.id}
              className={cn(
                'flex items-center px-4 py-3 border-b border-gray-100 transition-colors hover:bg-gray-50',
                bgClass
              )}
            >
              {/* Rank */}
              <div className={cn('w-10 text-center font-bold text-base', rankClass)}>
                {team.idx}
              </div>

              {/* Team */}
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image
                    src={getTeamLogoUrl(team.id, 'small')}
                    alt={team.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-sm text-gray-900 truncate">
                  {team.name}
                </span>
              </div>

              {/* Stats */}
              <div className="w-12 text-center text-sm text-gray-600">{team.played}</div>
              <div className="w-12 text-center text-sm text-gray-600">{team.wins}</div>
              <div className="w-12 text-center text-sm text-gray-600">{team.draws}</div>
              <div className="w-12 text-center text-sm text-gray-600">{team.losses}</div>
              <div className="w-14 text-center text-base font-extrabold text-gray-900">{team.pts}</div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-600 mb-2">Legend:</div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded" />
            <span className="text-xs text-gray-600">Champions League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded" />
            <span className="text-xs text-gray-600">Relegation</span>
          </div>
        </div>
      </div>
    </div>
  );
}