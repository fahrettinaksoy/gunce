<script setup lang="ts">
import { watch } from "vue";
import { useTheme } from "vuetify";
import { usePreferredDark } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "@/app/stores/useSettingsStore";
import DefaultLayout from "@/app/layouts/DefaultLayout.vue";
import NotificationScheduler from "@/shared/components/NotificationScheduler.vue";

const theme = useTheme();
const settingsStore = useSettingsStore();
const prefersDark = usePreferredDark();
const { locale } = useI18n();

watch(
  [() => settingsStore.theme, prefersDark],
  ([mode, isDark]) => {
    theme.global.name.value = mode === "system" ? (isDark ? "dark" : "light") : mode;
  },
  { immediate: true },
);

watch(
  () => settingsStore.locale,
  (value) => {
    locale.value = value;
  },
  { immediate: true },
);
</script>

<template>
  <DefaultLayout />
  <NotificationScheduler />
</template>
