'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMatchDetails } from '@/lib/hooks/useMatchDetails';
import { VideoPlayer } from '@/components/match-details/VideoPlayer';
import { MatchHeader } from '@/components/match-details/MatchHeader';
import { TabNavigation } from '@/components/match-details/TabNavigation';
import { OverviewTab } from '@/components/match-details/OverviewTab';
import { StatsTab } from '@/components/match-details/StatsTab';
import { LineupsTab } from '@/components/match-details/LineupsTab';
import { FactsTab } from '@/components/match-details/FactsTab';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

interface MatchDetailsClientProps {
  matchId: string;
}

export function MatchDetailsClient({ matchId }: MatchDetailsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'lineups' | 'facts'>('overview');
  
  const { data, header, general, facts, lineup, stats, isLoading, isError, refetch } = useMatchDetails(matchId);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 bg-surface border-b border-border px-5 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <span className="text-xl">←</span>
            <span className="font-semibold">Back</span>
          </button>
        </header>
        <Loading message="Loading match details..." fullScreen />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 bg-surface border-b border-border px-5 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <span className="text-xl">←</span>
            <span className="font-semibold">Back</span>
          </button>
        </header>
        <EmptyState
          icon="⚠️"
          title="Failed to load match details"
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
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border px-5 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <span className="text-xl">←</span>
          <span className="font-semibold">Match Details</span>
        </button>
      </header>

      {/* Video Player */}
      <VideoPlayer matchId={matchId} />

      {/* Match Header */}
      <MatchHeader header={header} general={general} />

      {/* Tabs */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'overview' && <OverviewTab data={data} facts={facts} />}
        {activeTab === 'stats' && <StatsTab facts={facts} />}
        {activeTab === 'lineups' && <LineupsTab lineup={lineup} />}
        {activeTab === 'facts' && <FactsTab facts={facts} general={general} />}
      </div>
    </div>
  );
}