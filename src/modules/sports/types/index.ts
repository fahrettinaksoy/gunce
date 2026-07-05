export interface FavoriteTeam {
  id: string;
  name: string;
  badgeUrl: string | null;
}

export interface MatchSummary {
  eventName: string;
  date: string;
  time: string | null;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
}

export interface ISportsProvider {
  searchTeam(name: string): Promise<FavoriteTeam | null>;
  getLastMatch(teamId: string): Promise<MatchSummary | null>;
  getNextMatch(teamId: string): Promise<MatchSummary | null>;
}
