import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ExchangeRateApiAdapter } from "@/modules/currency/services/exchangeRateApiAdapter";
import type { ExchangeRate } from "@/modules/currency/types";
import { isOlderThan } from "@/shared/utils/staleness";

const STALE_AFTER_MS = 1000 * 60 * 60 * 6;
const DEFAULT_FAVORITES = ["USD", "EUR", "GBP"];

const provider = new ExchangeRateApiAdapter();

export const useCurrencyStore = defineStore(
  "currency",
  () => {
    const favorites = ref<string[]>([...DEFAULT_FAVORITES]);
    const rates = ref<ExchangeRate[] | null>(null);
    const date = ref<string | null>(null);
    const lastFetchedAt = ref<number | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const thresholds = ref<Record<string, number>>({});
    const notifiedAboveThreshold = ref<Record<string, boolean>>({});

    function setThreshold(code: string, value: number | null) {
      if (value == null) {
        delete thresholds.value[code];
      } else {
        thresholds.value[code] = value;
      }
      notifiedAboveThreshold.value[code] = false;
    }

    async function fetchRates() {
      loading.value = true;
      error.value = null;
      try {
        const result = await provider.getRates(favorites.value);
        rates.value = result.rates;
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
      favorites,
      rates,
      date,
      lastFetchedAt,
      loading,
      error,
      isStale,
      thresholds,
      notifiedAboveThreshold,
      setThreshold,
      fetchRates,
    };
  },
  {
    persist: {
      pick: ["favorites", "rates", "date", "lastFetchedAt", "thresholds", "notifiedAboveThreshold"],
    },
  },
);
