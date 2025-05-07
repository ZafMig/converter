export type HistoricalExchangeRequest = {
  date: string;
  currencyFrom: string;
  currencyTo: string;
};

export type HistoricalExchangeRate = {
  date: string;
  rate: number;
};

export type HistoricalExchangeRateResponse = {
  rates: Record<string, number>;
};
