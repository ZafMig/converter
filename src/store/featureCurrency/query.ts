import {
  getCurrenciesCodes,
  getLatestExchange,
} from '@/api/Client/ClientCurrency';
import { CurrenciesRequest, ExchangeRate } from '@/api/Type/TypeCurrency';
import { createEffect } from 'effector';

export const getCurrencies = async (): Promise<CurrenciesRequest[]> => {
  const response = await getCurrenciesCodes();
  return response.data.supported_codes.map(([code, name]) => ({
    code,
    name,
  }));
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
