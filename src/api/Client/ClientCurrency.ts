import axios from 'axios';

import { ExchangeRateAPICurrency } from './currencies';
import {
  CurrenciesResponse,
  ExchangeListResponse,
  ExchangeRateResponse,
} from '../Type/TypeCurrency';

export const exchangeClient = axios.create({
  baseURL: `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGERATE_API_KEY}`,
});

export const getCurrenciesCodes = async () =>
  await exchangeClient.get<CurrenciesResponse>('/codes');

export const getCurrenciesExchangeRate = async (
  currencyFrom: string,
  currencyTo: string
) =>
  await exchangeClient.get<ExchangeRateResponse>(
    `/pair/${currencyFrom}/${currencyTo}`
  );

export const getLatestExchange = async (currency: ExchangeRateAPICurrency) =>
  await exchangeClient.get<ExchangeListResponse>(`/latest/${currency}`);
