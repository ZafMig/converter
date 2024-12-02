import axios from 'axios';
import { createQuery } from '@farfetched/core';
import { createEffect } from 'effector';

// клиенты
const client = axios.create({
  baseURL: `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}`,
});

const historyClient = axios.create({
  baseURL: `https://openexchangerates.org/api`,
  params: { app_id: import.meta.env.VITE_APP_ID },
});

// Типы
export type CurrenciesRequest = { code: string; name: string };
export type CurrenciesResponse = { supported_codes: Array<[string, string]> };

export type ExchangeRateRequest = { currencyFrom: string; currencyTo: string };
export type ExchangeRateResponse = { conversion_rate: number };

export type ExchangeListResponse = { conversion_rates: Record<string, number> };
export type ExchangeRate = {
  code: string;
  rate: number;
};

export type HistoricalExchangeRequest = {
  currencyFrom: string;
  currencyTo: string;
};
export type HistoricalExchangeRate = { date: string; rate: number };

//Farfetched

// Получение списка валют
export const getCurrencies = createEffect<void, CurrenciesRequest[], Error>(
  async () => {
    const response = await client.get<CurrenciesResponse>('/codes');
    return response.data.supported_codes.map(([code, name]) => ({
      code,
      name,
    }));
  }
);

export const getCurrenciesQuery = createQuery({
  effect: getCurrencies,
});

// Получение курса межу двумя
export const getExchangeRate = createEffect<ExchangeRateRequest, number, Error>(
  async ({ currencyFrom, currencyTo }) => {
    const response = await client.get<ExchangeRateResponse>(
      `/pair/${currencyFrom}/${currencyTo}`
    );
    return response.data.conversion_rate;
  }
);

export const getExchangeRateQuery = createQuery({
  effect: getExchangeRate,
});

// вращающаяся фигнгя
export const getExchangeListFx = createEffect<void, ExchangeRate[], Error>(
  async () => {
    const response = await client.get<ExchangeListResponse>('/latest/USD');
    return Object.entries(response.data.conversion_rates).map(
      ([code, rate]) => ({
        code,
        rate,
      })
    );
  }
);

export const getExchangeListQuery = createQuery({
  effect: getExchangeListFx,
});

// история
const getHistoricalRateFx = createEffect<
  { date: string; currencyFrom: string; currencyTo: string },
  HistoricalExchangeRate,
  Error
>(async ({ date, currencyFrom, currencyTo }) => {
  const response = await historyClient.get(`/historical/${date}.json`);
  return {
    date,
    rate: response.data.rates[currencyTo] / response.data.rates[currencyFrom],
  };
});

export const getHistoricalRatesQuery = createQuery({
  effect: getHistoricalRateFx,
});

// история за 10 дней
export const getExchangeRatesForLast10Days = async ({
  currencyFrom,
  currencyTo,
}: HistoricalExchangeRequest): Promise<HistoricalExchangeRate[]> => {
  const today = new Date();
  const dates = Array.from({ length: 10 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const queries = dates.map((date) =>
    getHistoricalRateFx({ date, currencyFrom, currencyTo })
  );

  const results = await Promise.all(queries);

  return results;
};