import { createI18n } from "vue-i18n";
import tr from "@/locales/tr.json";
import en from "@/locales/en.json";

const decimalFormat = {
  decimal: { minimumFractionDigits: 2, maximumFractionDigits: 4 },
};

export const i18n = createI18n({
  legacy: false,
  locale: "tr",
  fallbackLocale: "tr",
  messages: { tr, en },
  numberFormats: {
    tr: decimalFormat,
    en: decimalFormat,
  },
});
