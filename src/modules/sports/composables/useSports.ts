import { computed } from "vue";
import { useSportsStore } from "@/app/stores/useSportsStore";

export function useSports() {
  const sportsStore = useSportsStore();

  async function selectTeam(name: string) {
    await sportsStore.setFavoriteTeamByName(name);
  }

  async function refresh() {
    await sportsStore.fetchMatches();
  }

  return {
    favoriteTeam: computed(() => sportsStore.favoriteTeam),
    lastMatch: computed(() => sportsStore.lastMatch),
    nextMatch: computed(() => sportsStore.nextMatch),
    loading: computed(() => sportsStore.loading),
    error: computed(() => sportsStore.error),
    isStale: computed(() => sportsStore.isStale),
    selectTeam,
    refresh,
  };
}
