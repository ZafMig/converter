import { createStore, createEvent} from "effector";
import { getCurrencies } from "../api";


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
    currencyTo: 'EUR',
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
    .on(setCurrencyFrom, (state, currencyFrom) => ({ ...state, currencyFrom }))
    .on(setCurrencyTo, (state, currencyTo) => ({ ...state, currencyTo }))
    .on(swapCurrencies, (state) => ({
        ...state,
        currencyFrom: state.currencyTo,
        currencyTo: state.currencyFrom,
    }));

getCurrencies()
    .then((currencies) => updateCurrencies(currencies))
    .catch((error) => console.error("Ошибка загрузки валют:", error)); //запрос на загрузку списка валют и добавления в хранилищи