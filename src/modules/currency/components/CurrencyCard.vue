<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useCurrency } from "@/modules/currency/composables/useCurrency";

const { t, n } = useI18n();
const { rates, loading, error, isStale } = useCurrency();
</script>

<template>
  <v-card :to="{ name: 'currency' }" class="pa-4" hover>
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-1 font-weight-medium">{{ t("home.currency") }}</span>
      <v-icon icon="mdi-currency-try" />
    </div>

    <v-progress-circular v-if="loading" indeterminate size="24" />
    <p v-else-if="error" class="text-error text-body-2 mb-0">{{ error }}</p>
    <template v-else-if="rates">
      <div v-for="rate in rates" :key="rate.code" class="d-flex justify-space-between">
        <span class="text-body-2">{{ rate.code }}</span>
        <span class="text-body-2 font-weight-medium">{{ n(rate.rateInTry, "decimal") }} ₺</span>
      </div>
      <p v-if="isStale" class="text-caption text-warning mt-1 mb-0">{{ t("common.staleData") }}</p>
    </template>
  </v-card>
</template>
