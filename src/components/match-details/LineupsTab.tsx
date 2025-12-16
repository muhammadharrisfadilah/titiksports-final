import { Lineup, Player } from '@/types/match.types';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPlayerName } from '@/lib/utils/format.util';

interface LineupsTabProps {
  lineup?: Lineup;
}

export function LineupsTab({ lineup }: LineupsTabProps) {
  if (!lineup?.teams || lineup.teams.length === 0) {
    return <EmptyState icon="👥" title="Lineup not available" />;
  }

  const renderPlayerList = (players: Player[], type: 'starting' | 'substitute', teamIndex: number) => {
    if (!players || players.length === 0) return null;

    const isStarting = type === 'starting';
    const teamColor = teamIndex === 0 ? 'green' : 'blue';

    return (
      <div className={`${!isStarting ? 'mt-6 pt-6 border-t-2 border-dashed border-gray-200' : ''}`}>
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-base font-bold text-gray-800">
            {isStarting ? '⭐ Starting XI' : '🔄 Substitutes'}
          </h4>
          <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            {players.length} Players
          </span>
        </div>

        <div className="grid gap-3">
          {players.map((player, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md ${
                isStarting ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
              }`}
            >
              {/* Jersey Number */}
              <div className={`relative w-11 h-11 bg-${teamColor}-500 text-white rounded-lg flex items-center justify-center font-extrabold text-lg shadow-sm`}>
                {player.shirtNumber || '-'}
                {(player.captain || player.isCaptain) && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 text-black rounded-full flex items-center justify-center text-[10px] font-black">
                    C
                  </div>
                )}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-900 truncate">
                  {getPlayerName(player)}
                </div>
                <div className="text-xs text-gray-500">
                  {player.role?.name || player.position || 'N/A'}
                </div>
              </div>

              {/* Rating */}
              {player.rating?.num && (
                <div className="bg-yellow-400 text-black px-3 py-1 rounded-lg font-extrabold text-sm">
                  {player.rating.num}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {lineup.teams.map((team, index) => {
        const isHome = index === 0;
        const bgGradient = isHome 
          ? 'from-green-50 to-emerald-50' 
          : 'from-blue-50 to-sky-50';
        const borderColor = isHome ? 'border-green-500' : 'border-blue-500';

        return (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            {/* Team Header */}
            <div className={`bg-gradient-to-r ${bgGradient} p-5 border-b-4 ${borderColor}`}>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">{team.name}</h2>
              <p className="text-sm font-semibold text-gray-700">Formation: {team.formation}</p>
            </div>

            {/* Formation Visualization */}
            <div className="bg-gradient-to-b from-green-100 to-green-50 p-6 text-center border-b border-gray-200">
              <div className="text-5xl mb-3">⚽</div>
              <div className="text-lg font-bold text-gray-800">Formation: {team.formation}</div>
              <div className="text-xs text-gray-500 mt-2">Tap players for details</div>
            </div>

            {/* Manager */}
            {team.manager?.name && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-200 p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl">
                  👔
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Head Coach</div>
                  <div className="font-bold text-sm text-gray-900">{team.manager.name}</div>
                </div>
              </div>
            )}

            {/* Players */}
            <div className="p-5">
              {renderPlayerList(team.players?.starting || [], 'starting', index)}
              {renderPlayerList(team.players?.substitutes || [], 'substitute', index)}
            </div>
          </div>
        );
      })}
    </div>
  );
}