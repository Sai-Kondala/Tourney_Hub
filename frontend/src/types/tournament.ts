export type GameMode = "Battle Royale" | "Clash Squad";
export type TournamentCategory = "Solo" | "Squad" | "Duo";
export type TournamentStatus = "Upcoming" | "Live" | "Completed";
export type TournamentMap = "Bermuda" | "Purgatory" | "Kalahari" | "Alpine" | "NeXTerra";

export interface Tournament {
  id: string;
  title: string;
  subtitle: string;
  game: string;
  mode: GameMode;
  category: TournamentCategory;
  map: TournamentMap;
  entryFee: number; // 0 for free, in INR
  prizePool: number; // in INR
  maxParticipants: number;
  registeredParticipants: number;
  status: TournamentStatus;
  startDate: string; // ISO or formatted
  startTime: string;
  registrationDeadline: string;
  rules: string[];
  prizeBreakdown: {
    rank: string;
    prize: string;
  }[];
  featured: boolean;
  tier: "Challenger" | "Masters" | "Open" | "Invitational";
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  tag: string;
  avatarBg: string;
  category: "Squad" | "Solo";
  matches: number;
  wins: number;
  kills: number;
  points: number;
  winRate: string;
  trend: "up" | "down" | "same";
}

export interface PlatformStat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
}
