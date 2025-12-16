import { MatchDetails, MatchFacts } from '@/types/match.types';
import { getPlayerName } from '@/lib/utils/format.util';

interface OverviewTabProps {
  data?: MatchDetails;
  facts?: MatchFacts;
}

export function OverviewTab({ data, facts }: OverviewTabProps) {
  const events = facts?.events?.events || [];
  const goals = events.filter(e => e.type === 'Goal');
  const stats = facts?.events?.stats || [];

  // Quick stats
  const possessionStat = stats.find(s => s.title?.toLowerCase().includes('possession'));
  const shotsStat = stats.find(s => s.title?.toLowerCase().includes('shots') && !s.title?.toLowerCase().includes('on target'));
  const shotsOnTargetStat = stats.find(s => s.title?.toLowerCase().includes('on target'));

  return (
    <div className="space-y-4">
      {/* Score Summary */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6 text-center">
        <div className="text-sm opacity-90 mb-2">
          {data?.header?.status?.started 
            ? (data?.header?.status?.finished ? '⏹️ FULL TIME' : '🔴 LIVE') 
            : '⏰ UPCOMING'}
        </div>
        <div className="text-5xl font-extrabold my-3">
          {data?.header?.teams?.[0]?.score || 0} - {data?.header?.teams?.[1]?.score || 0}
        </div>
        <div className="text-sm opacity-90">
          {data?.header?.status?.reason?.long || 'Match Details'}
        </div>
      </div>

      {/* Quick Stats */}
      {(possessionStat || shotsStat || shotsOnTargetStat) && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <span>📊</span> Quick Stats
          </h3>
          
          <div className="space-y-5">
            {possessionStat && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-green-600">{possessionStat.stats?.[0] || 0}%</span>
                  <span className="text-sm font-semibold text-gray-600">⚽ Possession</span>
                  <span className="text-lg font-bold text-blue-600">{possessionStat.stats?.[1] || 0}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400"
                    style={{ width: `${possessionStat.stats?.[0] || 50}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-500"
                    style={{ width: `${possessionStat.stats?.[1] || 50}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {shotsStat && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {(shotsStat.stats?.[0] || 0) + (shotsStat.stats?.[1] || 0)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">🎯 Total Shots</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {shotsStat.stats?.[0] || 0} - {shotsStat.stats?.[1] || 0}
                  </div>
                </div>
              )}

              {shotsOnTargetStat && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {(shotsOnTargetStat.stats?.[0] || 0) + (shotsOnTargetStat.stats?.[1] || 0)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">🎯 On Target</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {shotsOnTargetStat.stats?.[0] || 0} - {shotsOnTargetStat.stats?.[1] || 0}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Goals Timeline */}
      {goals.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <span>⚽</span> Goals
          </h3>
          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  goal.isHome ? 'bg-green-50 border-l-4 border-green-500' : 'bg-blue-50 border-r-4 border-blue-500'
                } ${goal.isHome ? '' : 'flex-row-reverse text-right'}`}
              >
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                  ⚽
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{goal.nameStr || 'Player'}</div>
                  <div className="text-xs text-gray-500">{goal.eventString || 'Goal'}</div>
                </div>
                <div className="font-bold text-sm text-gray-700">{goal.time}'</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Players */}
      {facts?.topPlayers && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <span>🌟</span> Top Performers
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Home Top Players */}
            <div>
              <h4 className="text-xs font-semibold text-green-600 mb-3">
                {data?.header?.teams?.[0]?.name || 'Home'}
              </h4>
              <div className="space-y-2">
                {facts.topPlayers.homeTopPlayers?.slice(0, 3).map((player, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${i === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{getPlayerName(player)}</div>
                    </div>
                    {player.rating?.num && (
                      <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">
                        {player.rating.num}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Away Top Players */}
            <div>
              <h4 className="text-xs font-semibold text-blue-600 mb-3 text-right">
                {data?.header?.teams?.[1]?.name || 'Away'}
              </h4>
              <div className="space-y-2">
                {facts.topPlayers.awayTopPlayers?.slice(0, 3).map((player, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${i === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{getPlayerName(player)}</div>
                    </div>
                    {player.rating?.num && (
                      <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">
                        {player.rating.num}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player of the Match */}
      {facts?.playerOfTheMatch && (
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-5 text-center">
          <div className="text-4xl mb-2">⭐</div>
          <div className="text-xs opacity-90 uppercase tracking-wider mb-2">Player of the Match</div>
          <div className="text-xl font-bold mb-1">{getPlayerName(facts.playerOfTheMatch)}</div>
          <div className="text-sm opacity-90 mb-3">{facts.playerOfTheMatch.teamName}</div>
          {facts.playerOfTheMatch.rating?.num && (
            <div className="inline-block bg-white/20 px-5 py-2 rounded-full text-lg font-bold">
              ⭐ {facts.playerOfTheMatch.rating.num}
            </div>
          )}
        </div>
      )}
    </div>
  );
}