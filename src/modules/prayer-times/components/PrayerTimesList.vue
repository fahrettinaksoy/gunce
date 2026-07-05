<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { usePrayerTimes } from "@/modules/prayer-times/composables/usePrayerTimes";

const { t } = useI18n();
const { orderedTimings, nextPrayer } = usePrayerTimes();
</script>

<template>
  <v-list lines="two">
    <v-list-item
      v-for="item in orderedTimings"
      :key="item.key"
      :active="nextPrayer?.key === item.key"
    >
      <v-list-item-title>{{ t(`prayerTimes.${item.key}`) }}</v-list-item-title>
      <template #append>
        <span class="text-h6">{{ item.time }}</span>
      </template>
    </v-list-item>
  </v-list>
</template>
