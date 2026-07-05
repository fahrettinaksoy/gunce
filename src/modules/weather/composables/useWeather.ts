import { computed, watch } from "vue";
import { useLocationStore } from "@/app/stores/useLocationStore";
import { useWeatherStore } from "@/app/stores/useWeatherStore";

export function useWeather() {
  const locationStore = useLocationStore();
  const weatherStore = useWeatherStore();

  async function refresh() {
    if (!locationStore.query) return;
    await weatherStore.fetchCurrent(locationStore.query);
  }

  watch(
    () => locationStore.query,
    (query) => {
      if (query && (!weatherStore.snapshot || weatherStore.isStale)) refresh();
    },
    { immediate: true },
  );

  return {
    snapshot: computed(() => weatherStore.snapshot),
    loading: computed(() => weatherStore.loading),
    error: computed(() => weatherStore.error),
    isStale: computed(() => weatherStore.isStale),
    refresh,
  };
}
