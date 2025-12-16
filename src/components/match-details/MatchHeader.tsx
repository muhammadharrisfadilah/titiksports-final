import Image from 'next/image';
import { MatchHeader as MatchHeaderType, MatchGeneral } from '@/types/match.types';
import { formatMatchDate } from '@/lib/utils/date.util';
import { getTeamLogoUrl } from '@/lib/utils/format.util';

interface MatchHeaderProps {
  header?: MatchHeaderType;
  general?: MatchGeneral;
}

export function MatchHeader({ header, general }: MatchHeaderProps) {
  const homeTeam = header?.teams?.[0] || general?.homeTeam || { name: 'Home', id: '', score: 0 };
  const awayTeam = header?.teams?.[1] || general?.awayTeam || { name: 'Away', id: '', score: 0 };
  const leagueName = general?.leagueName || 'Football Match';
  const matchTime = general?.matchTimeUTCDate ? formatMatchDate(general.matchTimeUTCDate) : 'Time TBD';
  const status = header?.status?.reason?.long || 'Match Details';

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white p-5 border-b border-border">
      {/* League & Time */}
      <div className="text-center mb-5">
        <div className="text-sm font-semibold text-gray-600 mb-1">{leagueName}</div>
        <div className="text-xs text-gray-500">{matchTime}</div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-5 mb-5">
        {/* Home Team */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="relative w-18 h-18 mb-3">
            {homeTeam.id ? (
              <Image
                src={getTeamLogoUrl(homeTeam.id, 'medium')}
                alt={homeTeam.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                ⚽
              </div>
            )}
          </div>
          <h3 className="font-bold text-base leading-tight mb-1">{homeTeam.name}</h3>
          <div className="text-4xl font-extrabold text-primary">
            {homeTeam.score ?? '-'}
          </div>
        </div>

        {/* VS */}
        <div className="text-sm font-semibold text-gray-400 px-2">VS</div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="relative w-18 h-18 mb-3">
            {awayTeam.id ? (
              <Image
                src={getTeamLogoUrl(awayTeam.id, 'medium')}
                alt={awayTeam.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                ⚽
              </div>
            )}
          </div>
          <h3 className="font-bold text-base leading-tight mb-1">{awayTeam.name}</h3>
          <div className="text-4xl font-extrabold text-primary">
            {awayTeam.score ?? '-'}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        <span className="inline-block px-5 py-2 bg-primary text-white rounded-full text-sm font-bold">
          {status}
        </span>
      </div>
    </div>
  );
}