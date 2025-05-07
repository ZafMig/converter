export type CurrenciesRequest = { code: string; name: string };
export type CurrenciesResponse = { supported_codes: Array<[string, string]> };

export type ExchangeRateRequest = { currencyFrom: string; currencyTo: string };
export type ExchangeRateResponse = { conversion_rate: number };

export type ExchangeListResponse = { conversion_rates: Record<string, number> };
export type ExchangeRate = {
  code: string;
  rate: number;
};
