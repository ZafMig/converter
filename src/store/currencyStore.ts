import { createStore, createEvent} from "effector";
import { getCurrencies, getExchangeRate } from "../api";

type Currency = {
    code: string;
    name: string;
}

export const setAmountFrom = createEvent<number>();
export const setCurrencyFrom = createEvent<string>();
export const setCurrencyTo = createEvent<string>();
export const swapCurrencies = createEvent();
export const updateCurrencies = createEvent<Currency[]>();
export const updateExchangeRate = createEvent<number>();

const initialState ={
    currencies: [] as Currency[],
    amountFrom: 1,
    amountTo: 0,
    currencyFrom: 'USD',
    currencyTo: 'RUB',
    exchangeRate: 1,
}

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
    .on(setCurrencyFrom, (state, currencyFrom) => {
        fetchExchangeRate(currencyFrom, state.currencyTo); // Обновляем курс обмена
        return { ...state, currencyFrom };
      })
      .on(setCurrencyTo, (state, currencyTo) => {
        fetchExchangeRate(state.currencyFrom, currencyTo); // Обновляем курс обмена
        return { ...state, currencyTo };
      })
      .on(swapCurrencies, (state) => {
        const newCurrencyFrom = state.currencyTo;
        const newCurrencyTo = state.currencyFrom;
        fetchExchangeRate(newCurrencyFrom, newCurrencyTo); // Обновляем курс обмена
        return {
          ...state,
          currencyFrom: newCurrencyFrom,
          currencyTo: newCurrencyTo,
        };
      });
      const fetchExchangeRate = async (currencyFrom: string, currencyTo: string) => {
        try {
          const exchangeRate = await getExchangeRate({ currencyFrom, currencyTo });
          updateExchangeRate(exchangeRate); // Обновляем курс обмена в сторе
        } catch (error) {
          console.error("Ошибка загрузки курса обмена:", error);
        }
      };
      getCurrencies()
      .then((currencies) => {
        updateCurrencies(currencies); // Обновляем список валют
        const initialCurrencyFrom = initialState.currencyFrom;
        const initialCurrencyTo = initialState.currencyTo;
        fetchExchangeRate(initialCurrencyFrom, initialCurrencyTo); // Загрузка начального курса обмена
      })