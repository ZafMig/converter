import axios from "axios";

// Получаем ключ API из переменных окружения
const client = axios.create({
  baseURL: `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}`,
});

const historyClient = axios.create({
	baseURL: `https://openexchangerates.org/api`,
	params: { app_id: import.meta.env.VITE_APP_ID },
})

//Получение кодов
export type CurrenciesRequest = {code: string, name: string}
export type CurrenciesResponse = { supported_codes: Array<[string, string]> };

export const getCurrencies = async (): Promise<Array<{ code: string; name: string }>>=>{
    const {data} = await client.get<CurrenciesResponse>
    (`/codes`,{})
    return data.supported_codes.map(([code, name]) => ({ code, name }))
}

//ППолучение конверсии

export type ExchangeRateRequest = {currencyFrom: string, currencyTo: string};
export type ExchangeRateResponse = { conversion_rate: number };

export const getExchangeRate = async({
    currencyFrom,
    currencyTo
}: ExchangeRateRequest): Promise<number>=>{
    const {data} = await client.get<ExchangeRateResponse>
    (`/pair/${currencyFrom}/${currencyTo}`,{})
    return data.conversion_rate;
}

//Валюта сверху

export type ExchangeListResponse = { conversion_rates: Record<string, number> };

export const getExchangeList = async (): Promise<Array<{ code: string; rate: number }>> => {
    const { data } = await client.get<ExchangeListResponse>(`/latest/USD`, {});
    return Object.entries(data.conversion_rates).map(([code, rate]) => ({ code, rate }));
};

export type HistoricalExchangeRequest = { currencyFrom: string; currencyTo: string };
export type HistoricalExchangeRate = { date: string; rate: number };


//График
export const getExchangeRatesForLast10Days = async ({
	currencyTo,
}: HistoricalExchangeRequest): Promise<HistoricalExchangeRate[]> => {
	const today = new Date()
	const rates: HistoricalExchangeRate[] = []

	for (let i = 0; i < 10; i++) {
		const date = new Date(today)
		date.setDate(today.getDate() - i)
		const formattedDate = date.toISOString().split('T')[0]

		const response = await historyClient.get(`/historical/${formattedDate}.json`)

		rates.push({
			date: formattedDate,
			rate: response.data.rates[currencyTo],
		})
	}

	return rates
}