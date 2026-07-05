import { computed, watch } from "vue";
import { useCurrencyStore } from "@/app/stores/useCurrencyStore";

export function useCurrency() {
  const currencyStore = useCurrencyStore();

  async function refresh() {
    await currencyStore.fetchRates();
  }

  watch(
    () => currencyStore.favorites,
    () => {
      if (!currencyStore.rates || currencyStore.isStale) refresh();
    },
    { immediate: true },
  );

  return {
    rates: computed(() => currencyStore.rates),
    date: computed(() => currencyStore.date),
    loading: computed(() => currencyStore.loading),
    error: computed(() => currencyStore.error),
    isStale: computed(() => currencyStore.isStale),
    thresholds: computed(() => currencyStore.thresholds),
    setThreshold: currencyStore.setThreshold,
    refresh,
  };
}
