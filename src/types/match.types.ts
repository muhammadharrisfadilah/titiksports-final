// Match Types
export interface Match {
  id: string;
  home: Team;
  away: Team;
  status: MatchStatus;
  league?: League;
}

export interface Team {
  id: string;
  name: string;
  score?: number;
  imageUrl?: string;
}

export interface MatchStatus {
  started?: boolean;
  finished?: boolean;
  utcTime?: string;
  liveTime?: {
    short: string;
    long: string;
  };
  reason?: {
    short: string;
    long: string;
  };
}

export interface League {
  id: string;
  name: string;
  ccode?: string;
  matches?: Match[];
}

// Match Details
export interface MatchDetails {
  id: string;
  header?: MatchHeader;
  general?: MatchGeneral;
  content?: MatchContent;
}

export interface MatchHeader {
  teams: [Team, Team];
  status: MatchStatus;
}

export interface MatchGeneral {
  leagueName: string;
  matchTimeUTCDate: string;
  matchRound?: string;
  venueName?: string;
  referee?: string;
  homeTeam: Team;
  awayTeam: Team;
}

export interface MatchContent {
  matchFacts?: MatchFacts;
  lineup?: Lineup;
  stats?: MatchStats;
}

export interface MatchFacts {
  events?: {
    events: MatchEvent[];
    stats: StatItem[];
  };
  infoBox?: Record<string, any>;
  topPlayers?: {
    homeTopPlayers: Player[];
    awayTopPlayers: Player[];
  };
  playerOfTheMatch?: Player;
}

export interface MatchEvent {
  type: 'Goal' | 'Card' | 'Substitution';
  time: number;
  nameStr?: string;
  isHome: boolean;
  card?: 'Yellow' | 'Red';
  eventString?: string;
  swap?: Array<{ name: string }>;
}

export interface StatItem {
  title: string;
  stats: [number, number];
}

export interface Lineup {
  teams: LineupTeam[];
}

export interface LineupTeam {
  name: string;
  formation: string;
  players: {
    starting: Player[];
    substitutes: Player[];
  };
  manager?: {
    name: string;
  };
}

export interface Player {
  id: string;
  name: string | { fullName: string };
  shirtNumber?: number;
  position?: string;
  positionStringShort?: string;
  role?: { name: string };
  rating?: { num: number };
  captain?: boolean;
  isCaptain?: boolean;
  teamName?: string;
}

export interface MatchStats {
  home: Record<string, number>;
  away: Record<string, number>;
}

// API Response Types
export interface MatchesResponse {
  leagues: League[];
}

export interface StreamingData {
  match_id: string;
  sources: StreamingSource[];
  is_live: boolean;
  home_team: string;
  away_team: string;
  league: string;
}

export interface StreamingSource {
  type: 'HLS' | 'FLV' | 'MP4';
  source: string;
  quality?: string;
}