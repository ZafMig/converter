import { createStore, createEvent, createEffect, sample } from 'effector';

import { AppGate } from '../AppGate';
import { createQuery } from '@farfetched/core';

import { Currency, CurrencyStore } from './lib';
import { getCurrencies } from './query';
import { getExchangeRate } from '../featureExchange/query';

export const setAmountFrom = createEvent<number>();
export const setCurrencyFrom = createEvent<string>();
export const setCurrencyTo = createEvent<string>();
export const swapCurrencies = createEvent();
export const updateCurrencies = createEvent<Currency[]>();
export const updateExchangeRate = createEvent<number>();

export const ExchangeRateQuery = createQuery({ handler: getExchangeRate });
export const CurrencyQuery = createQuery({ handler: getCurrencies });

const fetchExchangeRateFx = createEffect(
  ({
    currencyFrom,
    currencyTo,
  }: {
    currencyFrom: string;
    currencyTo: string;
  }) => getExchangeRate({ currencyFrom, currencyTo })
);

const initialState: CurrencyStore = {
  currencies: [],
  amountFrom: 1,
  amountTo: 0,
  currencyFrom: 'USD',
  currencyTo: 'EUR',
  exchangeRate: 1,
};

export const $currencyStore = createStore(initialState)
  .on(updateCurrencies, (state, currencies) => ({
    ...state,
    currencies,
  }))
  .on(updateExchangeRate, (state, exchangeRate) => ({
    ...state,
    exchangeRate,
    amountTo: +(state.amountFrom * exchangeRate).toFixed(2),
  }))
  .on(setAmountFrom, (state, amountFrom) => ({
    ...state,
    amountFrom,
    amountTo: +(amountFrom * state.exchangeRate).toFixed(2),
  }))

  .on(setCurrencyFrom, (state, currencyFrom) => ({ ...state, currencyFrom }))

  .on(setCurrencyTo, (state, currencyTo) => ({ ...state, currencyTo }))

  .on(swapCurrencies, (state) => {
    const newCurrencyFrom = state.currencyTo; // Меняем местами валюты
    const newCurrencyTo = state.currencyFrom;

    return {
      ...state,
      currencyFrom: newCurrencyFrom,
      currencyTo: newCurrencyTo,
    };
  });

sample({
  clock: setCurrencyFrom,
  source: $currencyStore,
  fn: ({ currencyTo }, currencyFrom) => ({
    currencyFrom,
    currencyTo,
  }),
  target: ExchangeRateQuery.start,
});

sample({
  clock: setCurrencyTo,
  source: $currencyStore,
  fn: ({ currencyFrom }, currencyTo) => ({
    currencyTo,
    currencyFrom,
  }),
  target: ExchangeRateQuery.start,
});

sample({
  clock: ExchangeRateQuery.finished.success,
  fn: (s) => s.result,
  target: updateExchangeRate,
});

sample({
  clock: AppGate.open,
  target: CurrencyQuery.start,
});

sample({
  clock: CurrencyQuery.finished.success,
  fn: (s) => s.result,
  target: updateCurrencies,
});

sample({
  clock: CurrencyQuery.finished.success,
  source: $currencyStore,
  fn: (state) => ({
    currencyFrom: state.currencyFrom,
    currencyTo: state.currencyTo,
  }),
  target: fetchExchangeRateFx,
});

sample({
  clock: fetchExchangeRateFx.doneData,
  target: updateExchangeRate,
});

sample({
  clock: swapCurrencies,
  source: $currencyStore,
  fn: ({ currencyFrom, currencyTo }) => ({
    currencyFrom,
    currencyTo,
  }),
  target: fetchExchangeRateFx,
});
