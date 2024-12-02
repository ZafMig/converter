import styles from './History.module.scss';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Colors,
  Legend,
} from 'chart.js';
import { useGate, useUnit } from 'effector-react';
import { $currencyStore } from '../../store/currencyStore';
import {
  $error,
  $hidden,
  $rates,
  historicalStoreGate,
  setHidden,
} from '../../store/historyStore';

// Регистрация модулей Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Colors,
  Legend
);

const ExchangeRateChart: React.FC = () => {
  const { currencyFrom, currencyTo } = useUnit($currencyStore);
  const [rates, error, hidden] = useUnit([$rates, $error, $hidden]);

  useGate(historicalStoreGate, { currencyFrom, currencyTo });
  if (error) return <div>{error}</div>;

  const data = {
    labels: rates.map((rate) => rate.date),
    datasets: [
      {
        label: `${currencyFrom} to ${currencyTo}`,
        data: rates.map((rate) => rate.rate),
        borderColor: 'rgba(0, 255, 102, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: `Exchange Rate: ${currencyFrom} to ${currencyTo}`,
      },
    },
    scales: {
      y: { beginAtZero: false },
      x: { ticks: { autoSkip: true, maxTicksLimit: 10 } },
    },
  };



  return (
    <>
      {hidden ? (
        <button className={styles.HideButton} onClick={() => setHidden(false)}>
          Hide
        </button>
      ) : (
        <button className={styles.HideButton} onClick={() => setHidden(true)}>
          Show
        </button>
      )}
      {hidden && <Line data={data} options={options} />}
    </>
  );
};

export default ExchangeRateChart;