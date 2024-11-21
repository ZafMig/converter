import React, { useEffect, useState } from "react";
import { getExchangeRatesForLast10Days, HistoricalExchangeRate } from "../../api/";
import styles from "./History.module.scss"
import { Line } from "react-chartjs-2";
import { $currencyStore } from "../../store/currencyStore";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useUnit } from "effector-react";

// Регистрация модулей Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const History: React.FC = (
) => {
  const { currencyFrom, currencyTo } = useUnit($currencyStore);
  const [rates, setRates] = useState<HistoricalExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hidden, setHidden] = useState(true);
  
  useEffect(() => {
    const fetchRates = async () => {
        try {
          setLoading(true);
          const data = await getExchangeRatesForLast10Days({ currencyFrom, currencyTo });
          setRates(data.reverse());
        } catch (err: unknown) {
          setError("Failed to fetch exchange rates.");
          console.error(err); // или логируйте ошибку
        } finally {
          setLoading(false);
        }
      };

    fetchRates();
  }, [currencyFrom, currencyTo]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const data = {
    labels: rates.map((rate) => rate.date),
    datasets: [
      {
        label: `${currencyFrom} to ${currencyTo}`,
        data: rates.map((rate) => rate.rate),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: `Exchange Rate: ${currencyFrom} to ${currencyTo}` },
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
          Shov
        </button>
      )}
      {hidden && (
  <Line data={data} options={options} />

      )}

    </>

);
};

export default History;