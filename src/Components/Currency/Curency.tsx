import React, { useEffect } from 'react';
import { CurrencyInput } from '../CurrencyInput/CurrencyInput';
import styles from './Currency.module.scss';

import { useUnit } from 'effector-react';
import { getExchangeRate } from '@/api/Query/QueryCurrency';
import {
  $currencyStore,
  setAmountFrom,
  setCurrencyFrom,
  swapCurrencies,
  setCurrencyTo,
} from '@/store/featureCurrency/model';

const CurrencyConverter: React.FC = () => {
  const {
    currencies,
    amountFrom,
    amountTo,
    currencyFrom,
    currencyTo,
    exchangeRate,
  } = useUnit($currencyStore);

  useEffect(() => {
    getExchangeRate({ currencyFrom, currencyTo });
  }, [currencyFrom, currencyTo]);

  const handleAmountFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setAmountFrom(newAmount);
  };

  return (
    <div className={styles.Primary}>
      <h2 className={styles.PrimaryText}>†Who are You?†</h2>
      <CurrencyInput
        value={amountFrom}
        currencyFrom={currencyFrom}
        currencies={currencies}
        inputProps={{
          onChange: handleAmountFromChange,
          placeholder: 'Enter sum',
        }}
        onCurrencyChange={(newCurrency) => setCurrencyFrom(newCurrency)}
      />

      <button className={styles.Swap} onClick={() => swapCurrencies()}>
        Polarités ↑†↓ Inversées
      </button>

      <CurrencyInput
        value={amountTo}
        currencyFrom={currencyTo}
        currencies={currencies}
        inputProps={{
          placeholder: 'Result',
          disabled: true,
        }}
        onCurrencyChange={(newCurrency) => setCurrencyTo(newCurrency)}
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
