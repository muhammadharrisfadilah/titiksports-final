'use client';

import { useState, useEffect } from 'react';
import { useMatches } from '@/lib/hooks/useMatches';
import { DatePicker } from '@/components/layout/DatePicker';
import { FilterTabs } from '@/components/matches/FilterTabs';
import { LeagueSection } from '@/components/matches/LeagueSection';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { getMatchStatus } from '@/lib/utils/format.util';

export function MatchList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'finished' | 'scheduled'>('all');
  
  const { matches, isLoading, isError, refetch, backgroundRefresh, prefetchAdjacentDays } = useMatches({
    date: selectedDate,
  });

  // Prefetch adjacent days
  useEffect(() => {
    prefetchAdjacentDays();
  }, [selectedDate, prefetchAdjacentDays]);

  // Background refresh for live matches
  useEffect(() => {
    const interval = setInterval(() => {
      backgroundRefresh();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [backgroundRefresh]);

  // Filter matches
  const filteredLeagues = matches?.leagues?.map(league => ({
    ...league,
    matches: activeFilter === 'all' 
      ? league.matches 
      : league.matches?.filter(match => getMatchStatus(match) === activeFilter)
  })).filter(league => league.matches && league.matches.length > 0);

  if (isLoading) {
    return (
      <>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <Loading message="Loading matches..." />
      </>
    );
  }

  if (isError) {
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
      
      <div className="space-y-2 p-2">
        {filteredLeagues.map((league, index) => (
          <LeagueSection key={league.id || index} league={league} />
        ))}
      </div>
    </>
  );
}