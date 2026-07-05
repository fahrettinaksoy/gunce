<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { usePrayerTimes } from "@/modules/prayer-times/composables/usePrayerTimes";

const { t } = useI18n();
const { nextPrayer, loading, error, isStale } = usePrayerTimes();
</script>

<template>
  <v-card :to="{ name: 'prayer-times' }" class="pa-4" hover>
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-1 font-weight-medium">{{ t("home.prayerTimesCard") }}</span>
      <v-icon icon="mdi-mosque" />
    </div>

    <v-progress-circular v-if="loading" indeterminate size="24" />
    <p v-else-if="error" class="text-error text-body-2 mb-0">{{ error }}</p>
    <template v-else-if="nextPrayer">
      <p class="text-caption text-medium-emphasis mb-0">{{ t("prayerTimes.next") }}</p>
      <p class="text-h5 mb-0">{{ t(`prayerTimes.${nextPrayer.key}`) }} — {{ nextPrayer.time }}</p>
      <p v-if="isStale" class="text-caption text-warning mt-1 mb-0">{{ t("common.staleData") }}</p>
    </template>
    <p v-else class="text-body-2 text-medium-emphasis mb-0">{{ t("location.label") }}</p>
  </v-card>
</template>
