import CurrencyConverter from './Components/Currency/Curency';
import ExchangeRateChart from './Components/ExchangeHistory/ExchangeHistory';
import ExchangeRatesMarquee from './Components/ExchangeRatesMarque/ExchangeRatesMArque';
import PriceList from './Components/PriceList/PriceList';
import styles from './app.module.scss';

export const App = () => {
  return (
    <div className={styles.App}>
      <ExchangeRatesMarquee />
      <CurrencyConverter />
      <div className={styles.contentContainer}>
        <div className={styles.priceList}>
          <PriceList />
        </div>
        <div className={styles.exchangeRateChart}>
          <ExchangeRateChart />
        </div>
      </div>
    </div>
  );
};
