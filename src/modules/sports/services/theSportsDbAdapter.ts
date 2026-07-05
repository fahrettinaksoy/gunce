import type {
  FavoriteTeam,
  ISportsProvider,
  MatchSummary,
} from "@/modules/sports/types";

// TheSportsDB'nin ücretsiz test anahtarı ("123") üretim kullanımı için değil;
// ayrıca ücretsiz katman "Schedule Team Next/Previous" uç noktalarında sadece
// takımın İÇ SAHA (ev sahibi) maçlarını döndürüyor, deplasman maçları hariç.
// Ücretli bir anahtar (Patreon) edinildiğinde bu adapter değiştirilmeden
// sadece base URL/anahtar güncellenerek tam fikstür desteğine geçilebilir.
const BASE_URL = "https://www.thesportsdb.com/api/v1/json/123";

function toMatchSummary(event: Record<string, unknown> | null | undefined): MatchSummary | null {
  if (!event) return null;
  return {
    eventName: String(event.strEvent ?? ""),
    date: String(event.dateEvent ?? ""),
    time: event.strTime ? String(event.strTime).slice(0, 5) : null,
    homeTeam: String(event.strHomeTeam ?? ""),
    awayTeam: String(event.strAwayTeam ?? ""),
    homeScore: event.intHomeScore != null ? Number(event.intHomeScore) : null,
    awayScore: event.intAwayScore != null ? Number(event.intAwayScore) : null,
  };
}

export class TheSportsDbAdapter implements ISportsProvider {
  async searchTeam(name: string): Promise<FavoriteTeam | null> {
    const url = `${BASE_URL}/searchteams.php?t=${encodeURIComponent(name)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Takım aranamadı (${response.status})`);
    }
    const payload = await response.json();
    const team = payload?.teams?.[0];
    if (!team) return null;

    return {
      id: String(team.idTeam),
      name: String(team.strTeam),
      badgeUrl: team.strBadge ?? null,
    };
  }

  async getLastMatch(teamId: string): Promise<MatchSummary | null> {
    const url = `${BASE_URL}/eventslast.php?id=${encodeURIComponent(teamId)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Son maç bilgisi alınamadı (${response.status})`);
    }
    const payload = await response.json();
    return toMatchSummary(payload?.results?.[0]);
  }

  async getNextMatch(teamId: string): Promise<MatchSummary | null> {
    const url = `${BASE_URL}/eventsnext.php?id=${encodeURIComponent(teamId)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Sıradaki maç bilgisi alınamadı (${response.status})`);
    }
    const payload = await response.json();
    return toMatchSummary(payload?.events?.[0]);
  }
}
