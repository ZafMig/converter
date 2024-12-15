import { historyClient } from '../Client/ClientHisotry';
import {
  HistoricalExchangeRate,
  HistoricalExchangeRateResponse,
  HistoricalExchangeRequest,
} from '../Type/TypeHistory';

// исория
export const getHistoricalRateFx = async ({
  date,
  currencyFrom,
  currencyTo,
}: HistoricalExchangeRequest): Promise<HistoricalExchangeRate> => {
  const response = await historyClient.get<HistoricalExchangeRateResponse>(
    `/historical/${date}.json`
  );
  return {
    date,
    rate: response.data.rates[currencyTo] / response.data.rates[currencyFrom],
  };
};
