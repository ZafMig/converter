import { useGate, useUnit } from 'effector-react';
import Marquee from 'react-fast-marquee';
import styles from './ExchangeRatesMarquee.module.scss';
import { AppGate } from '../../store/AppGate';
import {
  $error,
  $exchangeRates,
  $pending,
} from '../../store/featureExchange/index';

const ExchangeRatesMarquee: React.FC = () => {
  useGate(AppGate);

  const { exchangeRates, error, pending } = useUnit({
    exchangeRates: $exchangeRates,
    error: $error,
    pending: $pending,
  });

  if (pending) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  if (exchangeRates.length === 0) {
    return <div>No data</div>;
  }

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
