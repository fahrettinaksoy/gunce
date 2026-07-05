import type { LocationQuery } from "@/shared/types/location";

export type WeatherCondition =
  | "clear"
  | "partlyCloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "showers"
  | "thunderstorm"
  | "unknown";

export interface WeatherSnapshot {
  temperatureC: number;
  condition: WeatherCondition;
  humidityPercent: number;
  windKph: number;
  observedAt: string;
}

export interface IWeatherProvider {
  getCurrent(query: LocationQuery): Promise<WeatherSnapshot>;
}
