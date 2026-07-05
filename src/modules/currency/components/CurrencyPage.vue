<script setup lang="ts">
import { reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCurrency } from "@/modules/currency/composables/useCurrency";

const { t, n } = useI18n();
const { rates, date, loading, error, isStale, thresholds, setThreshold, refresh } = useCurrency();

const alertInputs = reactive<Record<string, number | null>>({});

watch(
  thresholds,
  (value) => {
    for (const code of Object.keys(value)) {
      if (!(code in alertInputs)) alertInputs[code] = value[code];
    }
  },
  { immediate: true, deep: true },
);

function applyThreshold(code: string) {
  const value = alertInputs[code];
  setThreshold(code, value && value > 0 ? value : null);
}
</script>

<template>
  <v-container class="py-6" style="max-width: 640px">
    <h1 class="text-h5 mb-1">{{ t("currency.title") }}</h1>
    <p class="text-caption text-medium-emphasis mb-4">{{ t("currency.baseNote") }}</p>

    <v-alert v-if="isStale && !loading" type="warning" variant="tonal" class="mb-4" density="comfortable">
      {{ t("common.staleData") }}
    </v-alert>

    <v-progress-linear v-if="loading" indeterminate class="mb-4" />

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <template v-if="rates">
      <v-card v-for="rate in rates" :key="rate.code" class="pa-4 mb-3">
        <div class="d-flex align-center justify-space-between">
          <span class="text-body-1">{{ rate.code }} — {{ t(`currency.codes.${rate.code}`) }}</span>
          <span class="text-h6">{{ n(rate.rateInTry, "decimal") }} ₺</span>
        </div>
        <div class="d-flex ga-2 mt-2">
          <v-text-field
            v-model.number="alertInputs[rate.code]"
            :placeholder="t('currency.alertLabel')"
            type="number"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-bell-outline"
          />
          <v-btn size="small" variant="tonal" @click="applyThreshold(rate.code)">{{ t("currency.alertSet") }}</v-btn>
        </div>
      </v-card>
    </template>

    <p v-if="date" class="text-caption text-medium-emphasis mt-2">{{ date }}</p>

    <v-btn class="mt-4" variant="tonal" prepend-icon="mdi-refresh" @click="refresh">
      {{ t("common.refresh") }}
    </v-btn>
  </v-container>
</template>
