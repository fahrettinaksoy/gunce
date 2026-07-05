import type {
  IWeatherProvider,
  WeatherCondition,
  WeatherSnapshot,
} from "@/modules/weather/types";
import type { LocationQuery } from "@/shared/types/location";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

function mapWeatherCode(code: number): WeatherCondition {
  if (code === 0 || code === 1) return "clear";
  if (code === 2) return "partlyCloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([80, 81, 82].includes(code)) return "showers";
  if ([95, 96, 99].includes(code)) return "thunderstorm";
  return "unknown";
}

export class OpenMeteoAdapter implements IWeatherProvider {
  private async resolveCoords(query: LocationQuery): Promise<{ latitude: number; longitude: number }> {
    if (query.mode === "coords") {
      return { latitude: query.latitude, longitude: query.longitude };
    }

    const url = `${GEOCODING_URL}?name=${encodeURIComponent(query.city)}&count=1&language=tr&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Konum bulunamadı (${response.status})`);
    }
    const payload = await response.json();
    const result = payload?.results?.[0];
    if (!result) {
      throw new Error("Girilen şehir bulunamadı");
    }
    return { latitude: result.latitude, longitude: result.longitude };
  }

  async getCurrent(query: LocationQuery): Promise<WeatherSnapshot> {
    const { latitude, longitude } = await this.resolveCoords(query);
    const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Hava durumu alınamadı (${response.status})`);
    }

    const payload = await response.json();
    const current = payload?.current;
    if (!current) {
      throw new Error("Hava durumu yanıtı beklenmeyen formatta");
    }

    return {
      temperatureC: current.temperature_2m,
      condition: mapWeatherCode(current.weather_code),
      humidityPercent: current.relative_humidity_2m,
      windKph: current.wind_speed_10m,
      observedAt: current.time,
    };
  }
}
