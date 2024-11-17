import React, { useEffect } from "react";
import { CurrencySelect } from "../CurrencySelect/CurrencySelect";
import styles from "./Currency.module.scss";
import {
  $currencyStore,
  setAmountFrom,
  setCurrencyTo,
  swapCurrencies
} from "../../store/currencyStore";
import { useUnit } from "effector-react";
import { getExchangeRate } from "../../api";


const CurrencyConverter: React.FC = () => {
  const {
    currencies,
    amountFrom,
    amountTo,
    currencyFrom,
    currencyTo,
    exchangeRate,
  } = useUnit($currencyStore); // получаем весь букет

  useEffect(() => {
    getExchangeRate({ currencyFrom, currencyTo });
  }, [currencyFrom, currencyTo]);

  const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmountFrom(newAmount);
  };

  return (
    <div className={styles.Primary}>
      <h2 className={styles.PrimaryText}>Узнай курс</h2>
      <CurrencySelect
        value={amountFrom}
        currencyFrom={currencyFrom}
        currencies={currencies}
        inputProps={{
          onChange: handleAmountFromChange,
          placeholder: "Enter summ",
        }}
      />

      <button className={styles.Swap} onClick={() => swapCurrencies()}>
         ↑↓ 
      </button>

      <CurrencySelect
        value={amountTo}
        currencyFrom={currencyTo}
        currencies={currencies}
        inputProps={{
          onChange: (e) => setCurrencyTo(e.target.value),
          placeholder: "allo",
          disabled: true,
        }}
      />

      <p className={styles.Results}>
        Result: {amountFrom} {currencyFrom} = {amountTo} {currencyTo}
      </p>
      <p className={styles.Results}>
        1 {currencyFrom} = {exchangeRate.toFixed(2)} {currencyTo}
      </p>
    </div>
  );
};
export default CurrencyConverter;
