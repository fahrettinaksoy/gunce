import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { OpenMeteoAdapter } from "@/modules/weather/services/openMeteoAdapter";
import type { WeatherSnapshot } from "@/modules/weather/types";
import type { LocationQuery } from "@/shared/types/location";
import { isOlderThan } from "@/shared/utils/staleness";

const STALE_AFTER_MS = 1000 * 60 * 60;

const provider = new OpenMeteoAdapter();

export const useWeatherStore = defineStore(
  "weather",
  () => {
    const snapshot = ref<WeatherSnapshot | null>(null);
    const lastFetchedAt = ref<number | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function fetchCurrent(query: LocationQuery) {
      loading.value = true;
      error.value = null;
      try {
        snapshot.value = await provider.getCurrent(query);
        lastFetchedAt.value = Date.now();
      } catch (err) {
        error.value = err instanceof Error ? err.message : "Bilinmeyen hata";
      } finally {
        loading.value = false;
      }
    }

    const isStale = computed(() => isOlderThan(lastFetchedAt.value, STALE_AFTER_MS));

    return { snapshot, lastFetchedAt, loading, error, isStale, fetchCurrent };
  },
  {
    persist: {
      pick: ["snapshot", "lastFetchedAt"],
    },
  },
);
