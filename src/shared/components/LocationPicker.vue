<script setup lang="ts">
import { ref, watch } from "vue";
import { useGeolocation } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useLocationStore } from "@/app/stores/useLocationStore";

const { t } = useI18n();
const locationStore = useLocationStore();
const cityInput = ref(locationStore.city ?? "");

const { coords, error: geoError, resume } = useGeolocation({ immediate: false });

function useGps() {
  resume();
}

watch(coords, (value) => {
  if (value && Number.isFinite(value.latitude) && Number.isFinite(value.longitude)) {
    locationStore.setCoords({ latitude: value.latitude, longitude: value.longitude });
  }
});

function searchCity() {
  const city = cityInput.value.trim();
  if (city) locationStore.setCity(city);
}
</script>

<template>
  <v-card variant="tonal" class="pa-4">
    <div class="d-flex flex-column ga-3">
      <div class="d-flex ga-2">
        <v-text-field
          v-model="cityInput"
          :label="t('location.cityPlaceholder')"
          density="comfortable"
          hide-details
          @keyup.enter="searchCity"
        />
        <v-btn color="primary" @click="searchCity">{{ t("location.search") }}</v-btn>
      </div>
      <v-btn variant="text" prepend-icon="mdi-crosshairs-gps" @click="useGps">
        {{ t("location.useGps") }}
      </v-btn>
      <p v-if="geoError" class="text-caption text-error mb-0">{{ geoError.message }}</p>
    </div>
  </v-card>
</template>
