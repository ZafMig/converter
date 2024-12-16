export type HistoricalExchangeRequest = {
  date?: string;
  currencyFrom: string;
  currencyTo: string;
};

export type HistoricalExchangeRate = {
  date?: string;
  rate: number;
};

// Тип ответа от API
export type HistoricalExchangeRateResponse = {
  rates: Record<string, number>; // Объект с валютами и их значениями
};
