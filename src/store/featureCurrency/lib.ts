export type Currency = {
  code: string;
  name: string;
};

export type CurrencyStore = {
  currencies: Currency[];
  amountFrom: number;
  amountTo: number;
  currencyFrom: string;
  currencyTo: string;
  exchangeRate: number;
};
