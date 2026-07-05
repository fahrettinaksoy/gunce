import { computed, watch } from "vue";
import { useLocationStore } from "@/app/stores/useLocationStore";
import { usePrayerTimesStore } from "@/app/stores/usePrayerTimesStore";

const PRAYER_KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;

export function usePrayerTimes() {
  const locationStore = useLocationStore();
  const prayerTimesStore = usePrayerTimesStore();

  async function refresh() {
    if (!locationStore.query) return;
    await prayerTimesStore.fetchTimings(locationStore.query);
  }

  const orderedTimings = computed(() => {
    const timings = prayerTimesStore.timings;
    if (!timings) return [];
    return PRAYER_KEYS.map((key) => ({ key, time: timings[key] }));
  });

  const nextPrayer = computed(() => {
    const list = orderedTimings.value;
    if (!list.length) return null;

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (const item of list) {
      const [hours, minutes] = item.time.split(":").map(Number);
      if (hours * 60 + minutes > nowMinutes) return item;
    }
    return list[0];
  });

  watch(
    () => locationStore.query,
    (query) => {
      if (query && (!prayerTimesStore.timings || prayerTimesStore.isStale)) refresh();
    },
    { immediate: true },
  );

  return {
    timings: computed(() => prayerTimesStore.timings),
    orderedTimings,
    nextPrayer,
    loading: computed(() => prayerTimesStore.loading),
    error: computed(() => prayerTimesStore.error),
    isStale: computed(() => prayerTimesStore.isStale),
    date: computed(() => prayerTimesStore.date),
    refresh,
  };
}
