import { defineStore } from "pinia";
import { ref } from "vue";

export type ThemeMode = "light" | "dark" | "system";
export type AppLocale = "tr" | "en";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const theme = ref<ThemeMode>("system");
    const locale = ref<AppLocale>("tr");

    function setTheme(value: ThemeMode) {
      theme.value = value;
    }

    function setLocale(value: AppLocale) {
      locale.value = value;
    }

    return { theme, locale, setTheme, setLocale };
  },
  { persist: true },
);
