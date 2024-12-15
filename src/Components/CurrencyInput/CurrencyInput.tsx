import { ComponentProps, FC } from 'react';

import styles from './CurrencyInput.module.scss';

type Currency = {
  code: string;
  name: string;
};

export const CurrencyInput: FC<{
  value: number;
  currencyFrom: string;
  currencies: Currency[];
  inputProps: ComponentProps<'input'>;
  onCurrencyChange: (currency: string) => void; // Новый пропс
}> = ({ value, inputProps, currencyFrom, currencies, onCurrencyChange }) => (
  <div className={styles.InputContainer}>
    <input
      type="number"
      value={value}
      {...inputProps}
      className={styles.Input}
    />
    <select
      value={currencyFrom}
      onChange={(e) => onCurrencyChange(e.target.value)} // Вызываем функцию из пропсов
      className={styles.Select}
    >
      {currencies.map((currency) => (
        <option
          className={styles.SelectOption}
          key={currency.code}
          value={currency.code}
        >
          {currency.code}-{currency.name}
        </option>
      ))}
    </select>
  </div>
);
