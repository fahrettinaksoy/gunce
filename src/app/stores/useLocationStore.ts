import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { LocationQuery } from "@/shared/types/location";

export const useLocationStore = defineStore(
  "location",
  () => {
    const mode = ref<"coords" | "city" | null>(null);
    const city = ref<string | null>(null);
    const coords = ref<{ latitude: number; longitude: number } | null>(null);

    function setCity(value: string) {
      city.value = value;
      mode.value = "city";
      coords.value = null;
    }

    function setCoords(value: { latitude: number; longitude: number }) {
      coords.value = value;
      mode.value = "coords";
      city.value = null;
    }

    const query = computed<LocationQuery | null>(() => {
      if (mode.value === "coords" && coords.value) {
        return { mode: "coords", ...coords.value };
      }
      if (mode.value === "city" && city.value) {
        return { mode: "city", city: city.value };
      }
      return null;
    });

    return { mode, city, coords, query, setCity, setCoords };
  },
  { persist: true },
);
