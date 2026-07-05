<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { usePrayerTimesStore } from "@/app/stores/usePrayerTimesStore";
import { useCurrencyStore } from "@/app/stores/useCurrencyStore";
import { useSportsStore } from "@/app/stores/useSportsStore";
import { useNotifications } from "@/shared/composables/useNotifications";
import type { PrayerTimings } from "@/modules/prayer-times/types";

const { t } = useI18n();
const { notify } = useNotifications();
const prayerTimesStore = usePrayerTimesStore();
const currencyStore = useCurrencyStore();
const sportsStore = useSportsStore();

const notifiedPrayerKeys = new Set<string>();

function checkPrayerTimes() {
  const timings = prayerTimesStore.timings;
  const date = prayerTimesStore.date;
  if (!timings || !date) return;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  (Object.keys(timings) as Array<keyof PrayerTimings>).forEach((key) => {
    const [hours, minutes] = timings[key].split(":").map(Number);
    const dedupeKey = `${date}-${key}`;
    if (nowMinutes === hours * 60 + minutes && !notifiedPrayerKeys.has(dedupeKey)) {
      notifiedPrayerKeys.add(dedupeKey);
      notify(t("app.name"), t("notifications.prayerTime", { prayer: t(`prayerTimes.${key}`) }));
    }
  });
}

function checkCurrencyThresholds() {
  const rates = currencyStore.rates;
  if (!rates) return;

  for (const rate of rates) {
    const threshold = currencyStore.thresholds[rate.code];
    if (threshold == null) continue;

    const isAbove = rate.rateInTry >= threshold;
    const alreadyNotified = currencyStore.notifiedAboveThreshold[rate.code];

    if (isAbove && !alreadyNotified) {
      currencyStore.notifiedAboveThreshold[rate.code] = true;
      notify(
        t("app.name"),
        t("notifications.currencyThreshold", {
          code: rate.code,
          rate: rate.rateInTry.toFixed(2),
          threshold,
        }),
      );
    } else if (!isAbove && alreadyNotified) {
      currencyStore.notifiedAboveThreshold[rate.code] = false;
    }
  }
}

const notifiedMatches = new Set<string>();

function checkSportsMatch() {
  const match = sportsStore.nextMatch;
  if (!match || !match.time) return;

  const dedupeKey = `${match.date}-${match.homeTeam}-${match.awayTeam}`;
  if (notifiedMatches.has(dedupeKey)) return;

  const matchDateTime = new Date(`${match.date}T${match.time}`);
  const minutesUntilKickoff = (matchDateTime.getTime() - Date.now()) / 60_000;

  if (minutesUntilKickoff >= 0 && minutesUntilKickoff <= 10) {
    notifiedMatches.add(dedupeKey);
    notify(
      t("app.name"),
      t("notifications.matchStarting", { home: match.homeTeam, away: match.awayTeam }),
    );
  }
}

useIntervalFn(
  () => {
    checkPrayerTimes();
    checkCurrencyThresholds();
    checkSportsMatch();
  },
  30_000,
  { immediate: true },
);
</script>

<template></template>
