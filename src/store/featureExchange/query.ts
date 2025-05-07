import { getCurrenciesExchangeRate } from '@/api/Client/ClientCurrency';
import { ExchangeRateRequest } from '@/api/Type/TypeCurrency';

export const getExchangeRate = async ({
  currencyFrom,
  currencyTo,
}: ExchangeRateRequest): Promise<number> => {
  const response = await getCurrenciesExchangeRate(currencyFrom, currencyTo);
  return response.data.conversion_rate;
};
