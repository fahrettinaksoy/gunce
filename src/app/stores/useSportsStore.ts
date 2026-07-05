import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { TheSportsDbAdapter } from "@/modules/sports/services/theSportsDbAdapter";
import type { FavoriteTeam, MatchSummary } from "@/modules/sports/types";
import { isOlderThan } from "@/shared/utils/staleness";

const STALE_AFTER_MS = 1000 * 60 * 60 * 3;

const provider = new TheSportsDbAdapter();

export const useSportsStore = defineStore(
  "sports",
  () => {
    const favoriteTeam = ref<FavoriteTeam | null>(null);
    const lastMatch = ref<MatchSummary | null>(null);
    const nextMatch = ref<MatchSummary | null>(null);
    const lastFetchedAt = ref<number | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function setFavoriteTeamByName(name: string) {
      loading.value = true;
      error.value = null;
      try {
        const team = await provider.searchTeam(name);
        if (!team) {
          error.value = "Takım bulunamadı";
          return;
        }
        favoriteTeam.value = team;
        await fetchMatches();
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Bilinmeyen hata";
      } finally {
        loading.value = false;
      }
    }

    async function fetchMatches() {
      if (!favoriteTeam.value) return;
      loading.value = true;
      error.value = null;
      try {
        const [last, next] = await Promise.all([
          provider.getLastMatch(favoriteTeam.value.id),
          provider.getNextMatch(favoriteTeam.value.id),
        ]);
        lastMatch.value = last;
        nextMatch.value = next;
        lastFetchedAt.value = Date.now();
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Bilinmeyen hata";
      } finally {
        loading.value = false;
      }
    }

    const isStale = computed(() => isOlderThan(lastFetchedAt.value, STALE_AFTER_MS));

    return {
      favoriteTeam,
      lastMatch,
      nextMatch,
      lastFetchedAt,
      loading,
      error,
      isStale,
      setFavoriteTeamByName,
      fetchMatches,
    };
  },
  {
    persist: {
      pick: ["favoriteTeam", "lastMatch", "nextMatch", "lastFetchedAt"],
    },
  },
);
