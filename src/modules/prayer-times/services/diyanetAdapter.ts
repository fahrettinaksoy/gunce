import type { IPrayerTimesProvider, PrayerTimesResult } from "@/modules/prayer-times/types";
import type { LocationQuery } from "@/shared/types/location";

// Diyanet İşleri Başkanlığı'nın kendi API'si genel kullanıma açık değil;
// Aladhan'ın method=13 (Diyanet) hesaplama parametresi aynı vakitleri üretir.
const BASE_URL = "https://api.aladhan.com/v1";
const DIYANET_METHOD = 13;

function stripTimezoneSuffix(value: string): string {
  return value.split(" ")[0];
}

export class DiyanetAdapter implements IPrayerTimesProvider {
  async getTimings(query: LocationQuery): Promise<PrayerTimesResult> {
    const url =
      query.mode === "coords"
        ? `${BASE_URL}/timings?latitude=${query.latitude}&longitude=${query.longitude}&method=${DIYANET_METHOD}`
        : `${BASE_URL}/timingsByCity?city=${encodeURIComponent(query.city)}&country=Turkey&method=${DIYANET_METHOD}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Namaz vakitleri alınamadı (${response.status})`);
    }

    const payload = await response.json();
    const timings = payload?.data?.timings;
    const date = payload?.data?.date?.gregorian?.date;
    if (!timings || !date) {
      throw new Error("Namaz vakitleri yanıtı beklenmeyen formatta");
    }

    return {
      date,
      timings: {
        fajr: stripTimezoneSuffix(timings.Fajr),
        sunrise: stripTimezoneSuffix(timings.Sunrise),
        dhuhr: stripTimezoneSuffix(timings.Dhuhr),
        asr: stripTimezoneSuffix(timings.Asr),
        maghrib: stripTimezoneSuffix(timings.Maghrib),
        isha: stripTimezoneSuffix(timings.Isha),
      },
    };
  }
}
