import type { LocationQuery } from "@/shared/types/location";

export interface PrayerTimings {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerTimesResult {
  date: string;
  timings: PrayerTimings;
}

export interface IPrayerTimesProvider {
  getTimings(query: LocationQuery): Promise<PrayerTimesResult>;
}
