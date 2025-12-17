'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMatches } from '@/lib/hooks/useMatches';
import { DatePicker } from '@/components/layout/DatePicker';
import { FilterTabs } from '@/components/matches/FilterTabs';
import { LeagueSection } from '@/components/matches/LeagueSection';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { getMatchStatus } from '@/lib/utils/format.util';
import { MatchesResponse } from '@/types/match.types';
import apiService from '@/lib/services/api.service';

interface MatchListProps {
  initialData?: MatchesResponse | null;
}

export function MatchList({ initialData }: MatchListProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'finished' | 'scheduled'>('all');
  
  const { 
    matches, 
    isLoading, 
    isError, 
    refetch,
    backgroundRefresh 
  } = useMatches({
    date: selectedDate,
    initialData, // ✅ Use server-fetched data
  });

  // ✅ SMART REFRESH: Only refresh if there are live matches
  useEffect(() => {
    const hasLiveMatches = matches?.leagues?.some(league =>
      league.matches?.some(match => 
        match.status?.started && !match.status?.finished
      )
    );

    if (!hasLiveMatches) {
      return; // ❌ NO live matches = NO background refresh
    }

    // ✅ Refresh setiap 30 detik hanya untuk live matches
    const interval = setInterval(() => {
      backgroundRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [matches, backgroundRefresh]);

  // ✅ PREFETCH adjacent days on mount
  useEffect(() => {
    const prefetchDates = [-1, 1].map(offset => {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + offset);
      return date;
    });

    // Prefetch in background (non-blocking)
    setTimeout(() => {
      prefetchDates.forEach(date => {
        apiService.fetchMatches(date).catch(() => null);
      });
    }, 2000);
  }, [selectedDate]);

  // Filter matches
  const filteredLeagues = matches?.leagues?.map(league => ({
    ...league,
    matches: activeFilter === 'all' 
      ? league.matches 
      : league.matches?.filter(match => getMatchStatus(match) === activeFilter)
  })).filter(league => league.matches && league.matches.length > 0);

  // ✅ SHOW initial data immediately (no loading)
  if (isLoading && !matches) {
    return (
      <>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <Loading message="Loading matches..." />
      </>
    );
  }

  if (isError && !matches) {
    return (
      <>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <EmptyState
          icon="⚠️"
          title="Failed to load matches"
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
      </>
    );
  }

  if (!filteredLeagues || filteredLeagues.length === 0) {
    return (
      <>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <EmptyState
          icon="🔍"
          title={`No ${activeFilter} matches`}
          message="Try selecting a different filter or date."
          action={
            activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Show all matches
              </button>
            )
          }
        />
      </>
    );
  }

  return (
    <>
      <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      
      {/* ✅ Show loading indicator during background refresh */}
      {isLoading && matches && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-lg animate-pulse">
          🔄 Updating...
        </div>
      )}
      
      <div className="space-y-2 p-2">
        {filteredLeagues.map((league, index) => (
          <LeagueSection key={league.id || index} league={league} />
        ))}
      </div>
    </>
  );
}