import { createStore, createEffect, createEvent } from 'effector';
import axios from 'axios';

// Тип данных для курса валют
type ExchangeRate = {
    code: string;
    rate: number;
}

// Событие для обновления курсов валют
export const updateExchangeRates = createEvent();

// Эффект для получения данных с API
export const fetchExchangeRates = createEffect(async () => {
    try {
        const API_KEY = import.meta.env.VITE_API_KEY; 

        // Запрос к API
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
        const rates = response.data.conversion_rates;

        // Преобразуем данные в нужный формат
        return Object.entries(rates).map(([code, rate]) => ({
            code,
            rate: rate as number
        }));
    } catch (error) {
        console.error("Ошибка при загрузке курсов валют:", error);
        return [];  // Возвращаем пустой массив в случае ошибки
    }
});

// Магазин для хранения курсов валют
export const $exchangeRates = createStore<ExchangeRate[]>([])
    .on(fetchExchangeRates.doneData, (_, newRates) => newRates); // Просто заменяем старые курсы на новые

// Вызов эффекта для получения данных о курсах валют
fetchExchangeRates();
