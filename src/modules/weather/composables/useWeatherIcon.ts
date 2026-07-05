import type { WeatherCondition } from "@/modules/weather/types";

const ICONS: Record<WeatherCondition, string> = {
  clear: "mdi-weather-sunny",
  partlyCloudy: "mdi-weather-partly-cloudy",
  cloudy: "mdi-weather-cloudy",
  fog: "mdi-weather-fog",
  drizzle: "mdi-weather-partly-rainy",
  rain: "mdi-weather-rainy",
  snow: "mdi-weather-snowy",
  showers: "mdi-weather-pouring",
  thunderstorm: "mdi-weather-lightning",
  unknown: "mdi-weather-cloudy-alert",
};

export function useWeatherIcon(condition: WeatherCondition | null | undefined): string {
  if (!condition) return ICONS.unknown;
  return ICONS[condition];
}
