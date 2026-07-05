<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useWeather } from "@/modules/weather/composables/useWeather";
import { useWeatherIcon } from "@/modules/weather/composables/useWeatherIcon";

const { t } = useI18n();
const { snapshot, loading, error, isStale } = useWeather();

const icon = computed(() => useWeatherIcon(snapshot.value?.condition));
</script>

<template>
  <v-card :to="{ name: 'weather' }" class="pa-4" hover>
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-1 font-weight-medium">{{ t("home.weather") }}</span>
      <v-icon :icon="icon" />
    </div>

    <v-progress-circular v-if="loading" indeterminate size="24" />
    <p v-else-if="error" class="text-error text-body-2 mb-0">{{ error }}</p>
    <template v-else-if="snapshot">
      <p class="text-h5 mb-0">{{ Math.round(snapshot.temperatureC) }}°C</p>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ t(`weather.conditions.${snapshot.condition}`) }}</p>
      <p v-if="isStale" class="text-caption text-warning mt-1 mb-0">{{ t("common.staleData") }}</p>
    </template>
    <p v-else class="text-body-2 text-medium-emphasis mb-0">{{ t("location.label") }}</p>
  </v-card>
</template>
