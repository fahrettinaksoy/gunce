import "vuetify/styles";
import "@/assets/mdi/mdi-font-face.css";
import "@/assets/mdi/materialdesignicons-icons.css";
import { createVuetify, type ThemeDefinition } from "vuetify";

// Tam token seti tanımlı temalar. Sadece primary/secondary override etmek
// arkaplan (background/surface) ve metin (on-*) token'larını eksik bırakır;
// bu da yazı/zemin kontrastının bozulmasına yol açar. Aşağıdaki paletler
// hem light hem dark için WCAG AA kontrast hedefiyle seçilmiştir.

const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#F5F7FA",
    surface: "#FFFFFF",
    "surface-variant": "#E3E8EF",
    "on-surface-variant": "#3A424C",
    primary: "#0F6B5C",
    "on-primary": "#FFFFFF",
    secondary: "#2F5D8A",
    "on-secondary": "#FFFFFF",
    "on-background": "#1A2027",
    "on-surface": "#1A2027",
    success: "#2E7D32",
    warning: "#B25E00",
    error: "#C62828",
    info: "#0277BD",
  },
  variables: {
    "border-color": "#1A2027",
    "border-opacity": 0.12,
    "high-emphasis-opacity": 0.87,
    "medium-emphasis-opacity": 0.65,
  },
};

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#0E1116",
    surface: "#171C22",
    "surface-variant": "#232A32",
    "on-surface-variant": "#C4CBD4",
    primary: "#4CAF94",
    "on-primary": "#06231D",
    secondary: "#5B8FC7",
    "on-secondary": "#08121D",
    "on-background": "#E3E8EF",
    "on-surface": "#E3E8EF",
    success: "#66BB6A",
    warning: "#FFB74D",
    error: "#EF5350",
    info: "#4FC3F7",
  },
  variables: {
    "border-color": "#FFFFFF",
    "border-opacity": 0.14,
    "high-emphasis-opacity": 0.92,
    "medium-emphasis-opacity": 0.7,
  },
};

export const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
    themes: { light, dark },
  },
  defaults: {
    VCard: {
      variant: "elevated",
      rounded: "lg",
    },
  },
});
