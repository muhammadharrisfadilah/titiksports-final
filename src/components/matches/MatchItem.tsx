'use client';

import { Match } from '@/types/match.types';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';

interface MatchItemProps {
  match: Match;
}

export function MatchItem({ match }: MatchItemProps) {
  const isLive = match.status?.started && !match.status?.finished;
  const isFinished = match.status?.finished;
  const isScheduled = !match.status?.started && !match.status?.finished;

  // Format time
  const getTimeDisplay = () => {
    if (isFinished) return 'FT';
    if (isLive) return match.status?.liveTime?.short || 'LIVE';
    if (match.status?.utcTime) {
      try {
        const date = new Date(match.status.utcTime);
        return format(date, 'HH:mm');
      } catch {
        return 'TBD';
      }
    }
    return 'TBD';
  };

  // Get score display
  const getScore = (team: 'home' | 'away') => {
    if (isScheduled) return '-';
    const score = team === 'home' ? match.home.score : match.away.score;
    return score !== undefined ? score : '-';
  };

  return (
    <Link
      href={`/match/${match.id}`}
      className={clsx(
        'flex items-center gap-3 p-4 border-b border-border-light',
        'transition-all hover:bg-background active:bg-border-light',
        'cursor-pointer'
      )}
    >
      {/* Time */}
      <div
        className={clsx(
          'min-w-[52px] text-center text-[13px] font-semibold',
          'py-1 px-0 rounded bg-background',
          isLive && 'text-primary bg-primary/10 font-bold',
          isFinished && 'text-gray-400'
        )}
      >
        {getTimeDisplay()}
      </div>

      {/* Teams */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Home Team */}
        <div className="flex items-center gap-2.5">
          {match.home.imageUrl && (
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src={match.home.imageUrl}
                alt={match.home.name}
                fill
                className="object-contain rounded-full bg-background p-0.5"
                sizes="24px"
              />
            </div>
          )}
          <span className="text-sm text-text-primary truncate">
            {match.home.name}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2.5">
          {match.away.imageUrl && (
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src={match.away.imageUrl}
                alt={match.away.name}
                fill
                className="object-contain rounded-full bg-background p-0.5"
                sizes="24px"
              />
            </div>
          )}
          <span className="text-sm text-text-primary truncate">
            {match.away.name}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="min-w-[48px] text-center flex flex-col gap-3">
        <span
          className={clsx(
            'text-[17px] font-extrabold leading-none',
            isScheduled && 'text-gray-400 text-[15px] font-semibold'
          )}
        >
          {getScore('home')}
        </span>
        <span
          className={clsx(
            'text-[17px] font-extrabold leading-none',
            isScheduled && 'text-gray-400 text-[15px] font-semibold'
          )}
        >
          {getScore('away')}
        </span>
      </div>

      {/* Status Badge */}
      {isLive && (
        <div className="absolute top-3 right-4">
          <span className="inline-block px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide bg-primary text-white animate-pulse-slow">
            LIVE
          </span>
        </div>
      )}
    </Link>
  );
}