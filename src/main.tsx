import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ExchangeRatesMarquee from './Components/ExchangeRatesMArque/ExchangeRatesMArque';
import CurrencyConverter from './Components/Currency/Currency';
import PriceList from './Components/PriceList/PriceList';
import ExchangeRateChart from './Components/History/History';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExchangeRatesMarquee />
    <CurrencyConverter />
    <div className="content-container">
      <div className="price-list">
        <PriceList />
      </div>
      <div className="exchange-rate-chart">
        <ExchangeRateChart />
      </div>
    </div>
  </StrictMode>
);


