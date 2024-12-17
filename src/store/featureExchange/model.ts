import { createEffect, sample } from 'effector';

import { AppGate } from '../AppGate';
import { createQuery } from '@farfetched/core';

import { ExchangeRate } from '../../api/Type/TypeCurrency';
import {
  getExchangeListFx,
  getExchangeRate,
} from '../../api/Query/QueryCurrency';
import {
  setCurrencyTo,
  $currencyStore,
  updateExchangeRate,
} from '../featureCurrency/model';

export const fetchExchangeRates = createEffect<void, ExchangeRate[]>({
  handler: getExchangeListFx,
});
const getExchangeRateQuery = createQuery({
  handler: getExchangeRate,
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
