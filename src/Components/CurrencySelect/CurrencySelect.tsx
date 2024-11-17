import { ComponentProps, FC } from 'react'
import { setCurrencyFrom } from '../../store/currencyStore'

import styles from './CurrencySelect.module.scss'

type Currency = {
    code: string;
    name: string;
};


export const CurrencySelect: FC<{
  value: number;
  currencyFrom: string;
  currencies: Currency[];
  inputProps: ComponentProps<"input">;
}> = ({ value, inputProps, currencyFrom, currencies }) => (
  <div className={styles.InputContainer}>
    <input
      type="number"
      value={value}
      {...inputProps}
      className={styles.Input}
    />
    <select
      value={currencyFrom}
      onChange={(e) => setCurrencyFrom(e.target.value)}
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