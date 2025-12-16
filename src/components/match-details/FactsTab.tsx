import { MatchFacts, MatchGeneral } from '@/types/match.types';
import { EmptyState } from '@/components/ui/EmptyState';

interface FactsTabProps {
  facts?: MatchFacts;
  general?: MatchGeneral;
}

export function FactsTab({ facts, general }: FactsTabProps) {
  if (!facts) {
    return <EmptyState icon="📋" title="Match facts not available" />;
  }

  const events = facts.events?.events || [];
  const goals = events.filter(e => e.type === 'Goal');
  const cards = events.filter(e => e.type === 'Card');
  const substitutions = events.filter(e => e.type === 'Substitution');
  const homeGoals = goals.filter(e => e.isHome);
  const awayGoals = goals.filter(e => !e.isHome);

  return (
    <div className="space-y-4">
      {/* Match Summary */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6">
        <div className="text-center mb-5">
          <div className="text-xs opacity-90 uppercase tracking-wider mb-3">Match Summary</div>
          <div className="text-6xl font-extrabold mb-4">
            {goals.filter(g => g.isHome).length} : {goals.filter(g => !g.isHome).length}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">⚽ {goals.length}</div>
            <div className="text-[10px] opacity-90 mt-1">Goals</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">🟨 {cards.filter(c => c.card === 'Yellow').length}</div>
            <div className="text-[10px] opacity-90 mt-1">Yellow Cards</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">🔄 {substitutions.length}</div>
            <div className="text-[10px] opacity-90 mt-1">Substitutions</div>
          </div>
        </div>
      </div>

      {/* Goals Timeline */}
      {goals.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <span>⚽</span> Goals
          </h3>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-5">
            {/* Home Goals */}
            <div>
              {homeGoals.map((goal, index) => (
                <div key={index} className="flex items-start gap-3 mb-4 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-md">
                    ⚽
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-gray-900">{goal.nameStr || 'Player'}</div>
                    <div className="text-xs text-gray-600">{goal.time}' {goal.eventString ? `• ${goal.eventString}` : ''}</div>
                  </div>
                </div>
              ))}
              {homeGoals.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-5">No goals</div>
              )}
            </div>

            {/* Divider */}
            <div className="w-0.5 bg-gradient-to-b from-green-500 to-blue-500 rounded-full" />

            {/* Away Goals */}
            <div>
              {awayGoals.map((goal, index) => (
                <div key={index} className="flex items-start gap-3 mb-4 bg-blue-50 p-3 rounded-lg border-r-4 border-blue-500 flex-row-reverse text-right">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-md">
                    ⚽
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-gray-900">{goal.nameStr || 'Player'}</div>
                    <div className="text-xs text-gray-600">{goal.time}' {goal.eventString ? `• ${goal.eventString}` : ''}</div>
                  </div>
                </div>
              ))}
              {awayGoals.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-5">No goals</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cards & Substitutions */}
      <div className="grid grid-cols-2 gap-4">
        {/* Cards */}
        {cards.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span>🟨</span> Cards
            </h4>
            <div className="space-y-2">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    card.card === 'Yellow' ? 'bg-yellow-50 border-l-3 border-yellow-400' : 'bg-red-50 border-l-3 border-red-500'
                  }`}
                >
                  <div className="text-xl">{card.card === 'Yellow' ? '🟨' : '🟥'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-gray-900 truncate">{card.nameStr || 'Player'}</div>
                    <div className="text-[10px] text-gray-500">{card.time}'</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Substitutions */}
        {substitutions.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span>🔄</span> Subs
            </h4>
            <div className="space-y-2">
              {substitutions.slice(0, 6).map((sub, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded-lg border-l-3 border-gray-400">
                  <div className="text-[10px] text-gray-500 mb-1">{sub.time}'</div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-red-500">⬇️</span>
                    <span className="text-gray-600 truncate flex-1">{sub.swap?.[0]?.name || 'Out'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] mt-1">
                    <span className="text-green-500">⬆️</span>
                    <span className="font-semibold text-gray-900 truncate flex-1">{sub.swap?.[1]?.name || 'In'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Match Information */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <span>ℹ️</span> Match Details
        </h3>

        <div className="grid gap-3">
          {Object.entries(facts.infoBox || {}).map(([key, value]: [string, any]) => {
            if (['Tournament', 'Match Date', 'Stadium', 'Referee', 'Attendance'].includes(key)) {
              const icons: Record<string, string> = {
                'Tournament': '🏆',
                'Match Date': '📅',
                'Stadium': '🏟️',
                'Referee': '👨‍⚖️',
                'Attendance': '👥'
              };

              return (
                <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {icons[key]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">{key}</div>
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {value.name || value.text || value.venue || 'N/A'}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}