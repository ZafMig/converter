import axios from 'axios';
import { createQuery } from '@farfetched/core';
import { createEffect } from 'effector';

// клиенты
const client = axios.create({
  baseURL: `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}`,
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
export const getExchangeList = createEffect<void, ExchangeRate[], Error>(
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
  effect: getExchangeList,
});