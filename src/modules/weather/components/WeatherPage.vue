<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useLocationStore } from "@/app/stores/useLocationStore";
import { useWeather } from "@/modules/weather/composables/useWeather";
import { useWeatherIcon } from "@/modules/weather/composables/useWeatherIcon";
import LocationPicker from "@/shared/components/LocationPicker.vue";
import EmptyState from "@/shared/components/EmptyState.vue";

const { t } = useI18n();
const locationStore = useLocationStore();
const { snapshot, loading, error, isStale, refresh } = useWeather();

const icon = computed(() => useWeatherIcon(snapshot.value?.condition));
</script>

<template>
  <v-container class="py-6" style="max-width: 640px">
    <h1 class="text-h5 mb-4">{{ t("weather.title") }}</h1>

    <LocationPicker class="mb-6" />

    <EmptyState v-if="!locationStore.query" :message="t('location.label')" icon="mdi-map-marker-off" />

    <template v-else>
      <v-alert v-if="isStale && !loading" type="warning" variant="tonal" class="mb-4" density="comfortable">
        {{ t("common.staleData") }}
      </v-alert>

      <v-progress-linear v-if="loading" indeterminate class="mb-4" />

      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

      <v-card v-if="snapshot" variant="tonal" class="pa-6">
        <div class="d-flex align-center ga-4 mb-4">
          <v-icon :icon="icon" size="48" />
          <div>
            <p class="text-h3 mb-0">{{ Math.round(snapshot.temperatureC) }}°C</p>
            <p class="text-body-1 text-medium-emphasis mb-0">{{ t(`weather.conditions.${snapshot.condition}`) }}</p>
          </div>
        </div>
        <v-row>
          <v-col cols="6">
            <p class="text-caption text-medium-emphasis mb-0">{{ t("weather.humidity") }}</p>
            <p class="text-h6 mb-0">{{ snapshot.humidityPercent }}%</p>
          </v-col>
          <v-col cols="6">
            <p class="text-caption text-medium-emphasis mb-0">{{ t("weather.wind") }}</p>
            <p class="text-h6 mb-0">{{ Math.round(snapshot.windKph) }} km/s</p>
          </v-col>
        </v-row>
      </v-card>

      <v-btn class="mt-4" variant="tonal" prepend-icon="mdi-refresh" @click="refresh">
        {{ t("common.refresh") }}
      </v-btn>
    </template>
  </v-container>
</template>
