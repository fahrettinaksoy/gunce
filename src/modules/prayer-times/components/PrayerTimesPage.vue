<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useLocationStore } from "@/app/stores/useLocationStore";
import { usePrayerTimes } from "@/modules/prayer-times/composables/usePrayerTimes";
import PrayerTimesList from "./PrayerTimesList.vue";
import LocationPicker from "@/shared/components/LocationPicker.vue";
import EmptyState from "@/shared/components/EmptyState.vue";

const { t } = useI18n();
const locationStore = useLocationStore();
const { loading, error, date, isStale, refresh } = usePrayerTimes();
</script>

<template>
  <v-container class="py-6" style="max-width: 640px">
    <h1 class="text-h5 mb-4">{{ t("prayerTimes.title") }}</h1>

    <LocationPicker class="mb-6" />

    <EmptyState
      v-if="!locationStore.query"
      :message="t('location.label')"
      icon="mdi-map-marker-off"
    />

    <template v-else>
      <v-alert v-if="isStale && !loading" type="warning" variant="tonal" class="mb-4" density="comfortable">
        {{ t("common.staleData") }}
      </v-alert>

      <v-progress-linear v-if="loading" indeterminate class="mb-4" />

      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

      <p v-if="date" class="text-caption text-medium-emphasis mb-2">{{ date }}</p>

      <PrayerTimesList />

      <v-btn class="mt-4" variant="tonal" prepend-icon="mdi-refresh" @click="refresh">
        {{ t("common.refresh") }}
      </v-btn>
    </template>
  </v-container>
</template>
