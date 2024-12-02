import { createEffect, sample } from 'effector';
import { ExchangeRate, getExchangeList, getExchangeRateQuery } from '../../api';
import { AppGate } from '../appGate';
import { createQuery } from '@farfetched/core';
import { $currencyStore, setCurrencyTo, updateExchangeRate } from '../currencyStore';


export const fetchExchangeRates = createEffect<void, ExchangeRate[]>({
  handler: getExchangeList,
});
const exchangeRatesQuery = createQuery({ effect: fetchExchangeRates });
export const $exchangeRates = exchangeRatesQuery.$data.map(
  (state) => state ?? []
);
export const $pending = exchangeRatesQuery.$pending;
export const $error = exchangeRatesQuery.$error;

sample({
  clock: AppGate.open,
  target: exchangeRatesQuery.start,
});

sample({
    clock: setCurrencyTo,
    source: $currencyStore,
    fn: ({ currencyFrom }, currencyTo) => ({
      currencyTo,
      currencyFrom,
    }),
    target: getExchangeRateQuery.start,
  });
  
  sample({
    clock: getExchangeRateQuery.finished.success,
    fn: (s) => s.result,
    target: updateExchangeRate,
  });
