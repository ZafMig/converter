import { getHistoricalRate } from '@/api/Client/ClientHisotry';
import {
  HistoricalExchangeRequest,
  HistoricalExchangeRate,
} from '@/api/Type/TypeHistory';

export const getHistoricalRateFx = async ({
  date,
  currencyFrom,
  currencyTo,
}: HistoricalExchangeRequest): Promise<HistoricalExchangeRate> => {
  const response = await getHistoricalRate(currencyFrom, currencyTo, date);
  return {
    date,
    rate: response.data.rates[currencyTo] / response.data.rates[currencyFrom],
  };
};
