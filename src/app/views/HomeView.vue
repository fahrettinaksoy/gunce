<script setup lang="ts">
import { useI18n } from "vue-i18n";
import PrayerTimesCard from "@/modules/prayer-times/components/PrayerTimesCard.vue";
import WeatherCard from "@/modules/weather/components/WeatherCard.vue";
import CurrencyCard from "@/modules/currency/components/CurrencyCard.vue";
import SportsCard from "@/modules/sports/components/SportsCard.vue";

const { t } = useI18n();

const comingSoon = [{ key: "pharmacy", icon: "mdi-pharmacy" }] as const;
</script>

<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <PrayerTimesCard />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <WeatherCard />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <CurrencyCard />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <SportsCard />
      </v-col>
      <v-col v-for="item in comingSoon" :key="item.key" cols="12" sm="6" md="4">
        <v-card class="pa-4" variant="outlined" disabled>
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-subtitle-1 font-weight-medium">{{ t(`home.${item.key}`) }}</span>
            <v-icon :icon="item.icon" />
          </div>
          <v-chip size="small" variant="tonal">{{ t("home.comingSoon") }}</v-chip>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
