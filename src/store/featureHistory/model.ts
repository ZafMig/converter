import {
    createStore,
    createEvent,
    createEffect,
    sample,
    restore,
  } from 'effector';
  import { createGate } from 'effector-react';
  import { getExchangeRatesForLast10Days } from '../../api/apiHistory';
  
  // Gate
  export const historicalStoreGate = createGate<{
    currencyFrom: string;
    currencyTo: string;
  }>();
  
  // События
  export const setHidden = createEvent<boolean>();
  
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
  
  
  sample({
    clock: [historicalStoreGate.open, historicalStoreGate.state.updates],
    source: historicalStoreGate.state,
    fn: ({ currencyFrom, currencyTo }) => ({ currencyFrom, currencyTo }),
    target: fetchRatesFx,
  });