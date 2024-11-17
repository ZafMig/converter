import axios from "axios";

// Получаем ключ API из переменных окружения
const client = axios.create({
  baseURL: `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}`,
});

// ПОЛУЧАЕМ КОДЫ
export type CurrenciesRequest = { code: string; name: string };
export type CurrenciesResponse = { supported_codes: Record<string, string> };

export const getCurrencies = async (): Promise<Array<{ code: string; name: string }>> => {
  const { data } = await client.get<CurrenciesResponse>('/codes', {});
  return Object.entries(data.supported_codes).map(([code, name]) => ({
    code,
    name,
  }));
};

// ПОЛУЧАЕМ КОНВЕРСИЮ
export type ExchangeRateRequest = { currencyFrom: string; currencyTo: string };
export type ExchangeRateResponse = { conversion_rate: Record<string, string> };

export const getExchangeRate = async ({
  currencyFrom,
  currencyTo,
}: ExchangeRateRequest): Promise<Record<string, string>> => {
  const { data } = await client.get<ExchangeRateResponse>(`/pair/${currencyFrom}/${currencyTo}`, {});
  return data.conversion_rate;
};
