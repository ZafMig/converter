import { getHistoricalRate } from '../Client/ClientHisotry';
import {
  HistoricalExchangeRate,
  HistoricalExchangeRequest,
} from '../Type/TypeHistory';

export const getHistoricalRateFx = async ({
  date,
  currencyFrom,
  currencyTo,
}: HistoricalExchangeRequest): Promise<HistoricalExchangeRate> => {
  const response = await getHistoricalRate(
    currencyFrom,
    currencyTo,
    date || ''
  );
  return {
    date,
    rate: response.data.rates[currencyTo] / response.data.rates[currencyFrom],
  };
};
