import axios from 'axios';
import { HistoricalExchangeRateResponse } from '../Type/TypeHistory';

export const historyClient = axios.create({
  baseURL: `https://openexchangerates.org/api`,
  params: { app_id: import.meta.env.VITE_OPENEXCHANGERATES_API_KEY },
});

export const getHistoricalRate = async (
  _currencyFrom: string,
  _currencyTo: string,
  date: string
) =>
  await historyClient.get<HistoricalExchangeRateResponse>(
    `/historical/${date}.json`
  );
