import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { DiyanetAdapter } from "@/modules/prayer-times/services/diyanetAdapter";
import type { PrayerTimings } from "@/modules/prayer-times/types";
import type { LocationQuery } from "@/shared/types/location";
import { isOlderThan } from "@/shared/utils/staleness";

const STALE_AFTER_MS = 1000 * 60 * 60 * 12;

const provider = new DiyanetAdapter();

export const usePrayerTimesStore = defineStore(
  "prayerTimes",
  () => {
    const timings = ref<PrayerTimings | null>(null);
    const date = ref<string | null>(null);
    const lastFetchedAt = ref<number | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchTimings(query: LocationQuery) {
      loading.value = true;
      error.value = null;
      try {
        const result = await provider.getTimings(query);
        timings.value = result.timings;
        date.value = result.date;
        lastFetchedAt.value = Date.now();
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Bilinmeyen hata";
      } finally {
        loading.value = false;
      }
    }

    const isStale = computed(() => isOlderThan(lastFetchedAt.value, STALE_AFTER_MS));

    return {
      timings,
      date,
      lastFetchedAt,
      loading,
      error,
      isStale,
      fetchTimings,
    };
  },
  {
    persist: {
      pick: ["timings", "date", "lastFetchedAt"],
    },
  },
);
