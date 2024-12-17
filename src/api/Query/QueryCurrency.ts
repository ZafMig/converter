import { createEffect } from 'effector';
import {
  getCurrenciesCodes,
  getCurrenciesExchangeRate,
  getLatestExchange,
} from '../Client/ClientCurrency';
import {
  CurrenciesRequest,
  ExchangeRateRequest,
  ExchangeRate,
} from '../Type/TypeCurrency';

export const getCurrencies = async (): Promise<CurrenciesRequest[]> => {
  const response = await getCurrenciesCodes();
  return response.data.supported_codes.map(([code, name]) => ({
    code,
    name,
  }));
};

export const getExchangeRate = async ({
  currencyFrom,
  currencyTo,
}: ExchangeRateRequest): Promise<number> => {
  const response = await getCurrenciesExchangeRate(currencyFrom, currencyTo);
  return response.data.conversion_rate;
};

export const getExchangeListFx = createEffect<void, ExchangeRate[], Error>(
  async () => {
    const response = await getLatestExchange('USD');
    return Object.entries(response.data.conversion_rates).map(
      ([code, rate]) => ({
        code,
        rate,
      })
    );
  }
);
