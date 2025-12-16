'use client';

import { cn } from '@/lib/utils/cn';

interface FilterTabsProps {
  activeFilter: 'all' | 'live' | 'finished' | 'scheduled';
  onFilterChange: (filter: 'all' | 'live' | 'finished' | 'scheduled') => void;
}

const filters = [
  { value: 'all', label: 'All Matches' },
  { value: 'live', label: 'Live Now' },
  { value: 'finished', label: 'Finished' },
  { value: 'scheduled', label: 'Upcoming' },
] as const;

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="sticky top-[125px] z-40 bg-surface border-b border-border overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-4 py-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all',
              'hover:bg-background',
              activeFilter === filter.value
                ? 'bg-primary text-white font-semibold'
                : 'text-gray-600'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}