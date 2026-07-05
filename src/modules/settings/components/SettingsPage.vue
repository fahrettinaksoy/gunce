<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useSettingsStore, type AppLocale, type ThemeMode } from "@/app/stores/useSettingsStore";
import { useAppUpdater } from "@/shared/composables/useAppUpdater";

const { t, locale } = useI18n();
const settingsStore = useSettingsStore();
const { checking, installing, available, version, error, checkForUpdates, installUpdate } = useAppUpdater();

function setLocale(value: AppLocale) {
  settingsStore.setLocale(value);
  locale.value = value;
}

function setTheme(value: ThemeMode) {
  settingsStore.setTheme(value);
}
</script>

<template>
  <v-container class="py-6" style="max-width: 480px">
    <h1 class="text-h5 mb-6">{{ t("settings.title") }}</h1>

    <p class="text-subtitle-2 mb-2">{{ t("settings.theme") }}</p>
    <v-btn-toggle
      :model-value="settingsStore.theme"
      mandatory
      class="mb-6"
      @update:model-value="setTheme"
    >
      <v-btn value="light">{{ t("settings.light") }}</v-btn>
      <v-btn value="dark">{{ t("settings.dark") }}</v-btn>
      <v-btn value="system">{{ t("settings.system") }}</v-btn>
    </v-btn-toggle>

    <p class="text-subtitle-2 mb-2">{{ t("settings.language") }}</p>
    <v-btn-toggle :model-value="settingsStore.locale" mandatory class="mb-6" @update:model-value="setLocale">
      <v-btn value="tr">TR</v-btn>
      <v-btn value="en">EN</v-btn>
    </v-btn-toggle>

    <p class="text-subtitle-2 mb-2">{{ t("settings.updates") }}</p>
    <v-btn
      v-if="!available"
      variant="tonal"
      prepend-icon="mdi-cloud-refresh-outline"
      :loading="checking"
      @click="checkForUpdates"
    >
      {{ t("settings.checkForUpdates") }}
    </v-btn>
    <v-alert v-else type="info" variant="tonal" density="comfortable">
      {{ t("settings.updateAvailable", { version }) }}
      <template #append>
        <v-btn size="small" :loading="installing" @click="installUpdate">{{ t("settings.install") }}</v-btn>
      </template>
    </v-alert>
    <p v-if="error" class="text-caption text-medium-emphasis mt-2 mb-0">{{ error }}</p>
  </v-container>
</template>
