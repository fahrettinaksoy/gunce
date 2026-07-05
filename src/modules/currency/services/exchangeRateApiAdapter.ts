import type { ICurrencyProvider, ExchangeRatesResult } from "@/modules/currency/types";

const BASE_URL = "https://api.frankfurter.app";

// TCMB EVDS API bir API anahtarı kaydı gerektiriyor; anahtar sağlanana kadar
// ECB kaynaklı, anahtarsız Frankfurter servisi ara (interim) sağlayıcı olarak kullanılıyor.
// TCMBAdapter ileride bu arayüzü uygulayarak sorunsuzca yerini alabilir.
export class ExchangeRateApiAdapter implements ICurrencyProvider {
  async getRates(codes: string[]): Promise<ExchangeRatesResult> {
    const symbols = codes.join(",");
    const url = `${BASE_URL}/latest?from=TRY&to=${encodeURIComponent(symbols)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Döviz kurları alınamadı (${response.status})`);
    }

    const payload = await response.json();
    const rates = payload?.rates;
    const date = payload?.date;
    if (!rates || !date) {
      throw new Error("Döviz kuru yanıtı beklenmeyen formatta");
    }

    return {
      date,
      rates: codes.map((code) => ({
        code,
        rateInTry: 1 / rates[code],
      })),
    };
  }
}
