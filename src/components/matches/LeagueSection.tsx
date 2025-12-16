'use client';

import { useState } from 'react';
import { League } from '@/types/match.types';
import { MatchItem } from '@/components/matches/MatchItem';
import { cn } from '@/lib/utils/cn';

interface LeagueSectionProps {
  league: League;
}

export function LeagueSection({ league }: LeagueSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const matchCount = league.matches?.length || 0;

  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-sm">
      {/* League Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center px-4 py-3.5 hover:bg-background transition-colors border-b border-border"
      >
        <span className="text-lg mr-3">⚽</span>
        <span className="flex-1 text-left font-bold text-[14px] text-text-primary">
          {league.name}
        </span>
        <span className="bg-primary text-white px-2.5 py-1 rounded-xl text-[12px] font-bold mr-3 min-w-[28px] text-center">
          {matchCount}
        </span>
        <span 
          className={cn(
            'text-[12px] text-gray-400 transition-transform',
            isExpanded && 'rotate-180'
          )}
        >
          ▼
        </span>
      </button>

      {/* Matches */}
      <div 
        className={cn(
          'transition-all duration-300 overflow-hidden',
          isExpanded ? 'max-h-[5000px]' : 'max-h-0'
        )}
      >
        {league.matches?.map((match) => (
          <MatchItem key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}