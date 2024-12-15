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
import { getHistoricalRateFx } from '../../api/Query/QueryHistory';

// Gate
export const historicalStoreGate = createGate<{
  currencyFrom: string;
  currencyTo: string;
}>();

// События
export const setHidden = createEvent<boolean>();

const getExchangeRatesForLast10Days = async ({
  currencyFrom,
  currencyTo,
}: HistoricalExchangeRequest): Promise<HistoricalExchangeRate[]> => {
  const today = new Date();
  const dates = Array.from({ length: 10 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const queries = dates.map((date) =>
    getHistoricalRateFx({ date, currencyFrom, currencyTo })
  );

  const results = await Promise.all(queries);

  return results;
};

// Эффекты
export const fetchRatesFx = createEffect(
  async ({
    currencyFrom,
    currencyTo,
  }: {
    currencyFrom: string;
    currencyTo: string;
  }) => {
    const data = await getExchangeRatesForLast10Days({
      currencyFrom,
      currencyTo,
    });
    return data.reverse();
  }
);

// Сторы
export const $rates = restore(fetchRatesFx.doneData, []);
export const $error = createStore<string | null>(null)
  .on(fetchRatesFx.failData, () => 'Failed to fetch exchange rates.')
  .reset(fetchRatesFx.done);

export const $hidden = createStore(true).on(setHidden, (_, hidden) => hidden);

// открытие Gate починено афигеть
sample({
  clock: [historicalStoreGate.open, historicalStoreGate.state.updates],
  source: historicalStoreGate.state,
  fn: ({ currencyFrom, currencyTo }) => ({ currencyFrom, currencyTo }),
  target: fetchRatesFx,
});
