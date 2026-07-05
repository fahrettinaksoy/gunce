export interface ExchangeRate {
  code: string;
  rateInTry: number;
}

export interface ExchangeRatesResult {
  date: string;
  rates: ExchangeRate[];
}

export interface ICurrencyProvider {
  getRates(codes: string[]): Promise<ExchangeRatesResult>;
}
