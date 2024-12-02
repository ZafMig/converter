import { createStore, createEvent, createEffect, sample } from 'effector';
import { getCurrencies, getExchangeRate } from '../api';
import { AppGate } from './appGate';

type Currency = {
  code: string;
  name: string;
};

//region Events
export const setAmountFrom = createEvent<number>();
export const setCurrencyFrom = createEvent<string>();
export const setCurrencyTo = createEvent<string>();
export const swapCurrencies = createEvent();
export const updateCurrencies = createEvent<Currency[]>();
export const updateExchangeRate = createEvent<number>();
//endregion

//region Effects
export const getExchangeRateFx = createEffect({ handler: getExchangeRate });
//endregion

const initialState = {
  currencies: [] as Currency[],
  amountFrom: 1,
  amountTo: 0,
  currencyFrom: 'USD',
  currencyTo: 'RUB',
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
  target: getExchangeRateFx,
});

sample({
  clock: setCurrencyTo,
  source: $currencyStore,
  fn: ({ currencyFrom }, currencyTo) => ({
    currencyTo,
    currencyFrom,
  }),
  target: getExchangeRateFx,
});

sample({
  clock: getExchangeRateFx.doneData,
  target: updateExchangeRate,
});

sample({
  clock: AppGate.open,
});

// фэект для заргузки списка валют
export const getCurrenciesFx = createEffect({ handler: getCurrencies });

sample({
  clock: AppGate.open,
  target: getCurrenciesFx,
});

sample({
  clock: getCurrenciesFx.doneData,
  target: updateCurrencies,
});

const fetchExchangeRateFx = createEffect(
  ({
    currencyFrom,
    currencyTo,
  }: {
    currencyFrom: string;
    currencyTo: string;
  }) => getExchangeRate({ currencyFrom, currencyTo })
);

sample({
  clock: getCurrenciesFx.doneData,
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
    currencyFrom, // Новый From после swap
    currencyTo, // Новый To после swap
  }),
  target: fetchExchangeRateFx,
});