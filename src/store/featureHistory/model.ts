import {
  createStore,
  createEvent,
  createEffect,
  sample,
  restore,
} from 'effector';
import { createGate } from 'effector-react';

import {
  HistoricalExchangeRate,
  HistoricalExchangeRequest,
} from '../../api/Type/TypeHistory';
import { getHistoricalRateFx } from './query';

export const historicalStoreGate = createGate<{
  currencyFrom: string;
  currencyTo: string;
}>();

export const setHidden = createEvent<boolean>();

const getExchangeRatesForLast10Days = async ({
  date: today,
  currencyFrom,
  currencyTo,
}: HistoricalExchangeRequest): Promise<HistoricalExchangeRate[]> => {
  const dates = Array.from({ length: 10 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const queries = dates.map((date) =>
    getHistoricalRateFx({ date, currencyFrom, currencyTo })
  );

  const results = await Promise.all(queries);

  return results;
};

export const fetchRatesFx = createEffect(
  async ({
    currencyFrom,
    currencyTo,
  }: {
    currencyFrom: string;
    currencyTo: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];

    const data = await getExchangeRatesForLast10Days({
      date: today,
      currencyFrom,
      currencyTo,
    });

    return data.reverse();
  }
);

export const $rates = restore(fetchRatesFx.doneData, []);
export const $error = createStore<string | null>(null)
  .on(fetchRatesFx.failData, () => 'Failed to fetch exchange rates.')
  .reset(fetchRatesFx.done);

export const $hidden = createStore(true).on(setHidden, (_, hidden) => hidden);

sample({
  clock: [historicalStoreGate.open, historicalStoreGate.state.updates],
  source: historicalStoreGate.state,
  fn: ({ currencyFrom, currencyTo }) => ({ currencyFrom, currencyTo }),
  target: fetchRatesFx,
});
