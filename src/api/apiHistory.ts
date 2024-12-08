import axios from "axios";
import { createQuery } from '@farfetched/core';
import { createEffect } from 'effector';


const historyClient = axios.create({
    baseURL: `https://openexchangerates.org/api`,
    params: { app_id: import.meta.env.VITE_APP_ID },
  });

  export type HistoricalExchangeRequest = {
    currencyFrom: string;
    currencyTo: string;
  };
  export type HistoricalExchangeRate = { date: string; rate: number };

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