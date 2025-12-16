import { Match } from '@/types/match.types';

/**
 * Get match status
 */
export function getMatchStatus(match: Match): 'live' | 'finished' | 'scheduled' {
  if (match.status?.finished) return 'finished';
  if (match.status?.started && !match.status?.finished) return 'live';
  return 'scheduled';
}

/**
 * Get team logo URL
 */
export function getTeamLogoUrl(teamId: string | number, size: 'small' | 'medium' | 'large' = 'small'): string {
  return `https://images.fotmob.com/image_resources/logo/teamlogo/${teamId}_${size}.png`;
}

/**
 * Get league logo URL
 */
export function getLeagueLogoUrl(leagueId: string | number): string {
  return `https://images.fotmob.com/image_resources/logo/leaguelogo/${leagueId}.png`;
}

/**
 * Format number with separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Get player name (handle different name formats)
 */
export function getPlayerName(player: any): string {
  if (typeof player.name === 'string') {
    return player.name;
  }
  
  if (player.name?.fullName) {
    return player.name.fullName;
  }
  
  if (player.firstName && player.lastName) {
    return `${player.firstName} ${player.lastName}`.trim();
  }
  
  return 'Unknown Player';
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}