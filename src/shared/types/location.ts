export type LocationQuery =
  | { mode: "coords"; latitude: number; longitude: number }
  | { mode: "city"; city: string };
