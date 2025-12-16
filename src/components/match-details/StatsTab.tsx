import { MatchFacts } from '@/types/match.types';
import { EmptyState } from '@/components/ui/EmptyState';

interface StatsTabProps {
  facts?: MatchFacts;
}

export function StatsTab({ facts }: StatsTabProps) {
  const stats = facts?.events?.stats || [];

  if (stats.length === 0) {
    return <EmptyState icon="📊" title="Statistics not available" />;
  }

  // Get emoji for stat type
  const getStatEmoji = (title: string): string => {
    const t = title.toLowerCase();
    if (t.includes('possession')) return '⚽';
    if (t.includes('shots')) return '🎯';
    if (t.includes('passes')) return '🔄';
    if (t.includes('corners')) return '🚩';
    if (t.includes('fouls')) return '⚠️';
    if (t.includes('yellow')) return '🟨';
    if (t.includes('red')) return '🟥';
    if (t.includes('offsides')) return '🚫';
    if (t.includes('saves')) return '🧤';
    return '📊';
  };

  return (
    <div className="space-y-4">
      {/* Main Stats Card */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
        <h3 className="font-bold text-base mb-5 flex items-center gap-2">
          <span>📊</span> Detailed Match Statistics
        </h3>

        <div className="space-y-6">
          {stats.map((stat, index) => {
            const homeValue = stat.stats?.[0] || 0;
            const awayValue = stat.stats?.[1] || 0;
            
            // Calculate percentages
            let homePercent = 50;
            let awayPercent = 50;
            
            if (stat.title?.toLowerCase().includes('possession')) {
              homePercent = homeValue;
              awayPercent = awayValue;
            } else {
              const total = homeValue + awayValue;
              if (total > 0) {
                homePercent = Math.round((homeValue / total) * 100);
                awayPercent = 100 - homePercent;
              }
            }

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-extrabold text-green-600 min-w-[60px] text-center">
                    {homeValue}{stat.title?.includes('possession') ? '%' : ''}
                  </span>
                  <div className="flex-1 text-center px-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      {getStatEmoji(stat.title || '')} {stat.title}
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                        style={{ width: `${homePercent}%` }}
                      />
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${awayPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>{homePercent}%</span>
                      <span>{awayPercent}%</span>
                    </div>
                  </div>
                  <span className="text-xl font-extrabold text-blue-600 min-w-[60px] text-center">
                    {awayValue}{stat.title?.includes('possession') ? '%' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {stats.slice(0, 6).map((stat, index) => {
          const homeValue = stat.stats?.[0] || 0;
          const awayValue = stat.stats?.[1] || 0;
          const total = homeValue + awayValue;

          return (
            <div key={index} className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-4 text-center">
              <div className="text-xs opacity-90 mb-2">{stat.title}</div>
              <div className="text-3xl font-extrabold mb-1">{total}</div>
              <div className="text-sm opacity-80">{homeValue} - {awayValue}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}