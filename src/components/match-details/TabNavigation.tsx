'use client';

import { cn } from '@/lib/utils/cn';

interface TabNavigationProps {
  activeTab: 'overview' | 'stats' | 'lineups' | 'facts';
  onTabChange: (tab: 'overview' | 'stats' | 'lineups' | 'facts') => void;
}

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'stats', label: 'Statistics' },
  { value: 'lineups', label: 'Lineups' },
  { value: 'facts', label: 'Match Facts' },
] as const;

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="sticky top-[73px] z-40 flex bg-surface border-b border-border overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            'flex-1 min-w-[80px] px-3 py-4 text-center text-sm font-semibold transition-all relative',
            'hover:bg-background',
            activeTab === tab.value
              ? 'text-primary'
              : 'text-gray-600'
          )}
        >
          {tab.label}
          {activeTab === tab.value && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t" />
          )}
        </button>
      ))}
    </nav>
  );
}