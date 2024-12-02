import { useGate, useUnit } from 'effector-react';
import Marquee from 'react-fast-marquee';
import styles from './ExchangeRatesMArque.module.scss';
import { $exchangeRates } from '../../store/exchangeStore';
import { AppGate } from '../../store/appGate';

const ExchangeRatesMarquee: React.FC = () => {
  useGate(AppGate);
  const exchangeRates = useUnit($exchangeRates);

  return (
    <Marquee gradient={false} speed={50}>
      {exchangeRates.map((rate) => (
        <span
          className={styles.Marquee}
          key={rate.code}
          style={{ marginRight: '20px', fontSize: '18px' }}
        >
          {rate.code}: {rate.rate.toFixed(2)}
        </span>
      ))}
    </Marquee>
  );
};

export default ExchangeRatesMarquee;