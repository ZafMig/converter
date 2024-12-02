import { StrictMode } from 'react';
import ExchangeRatesMarquee from './Components/ExchangeRatesMArque/ExchangeRatesMArque';
import CurrencyConverter from './Components/Currency/Currency';
import PriceList from './Components/PriceList/PriceList';
import ExchangeRateChart from './Components/History/History';

export const App = () =>{

return(
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
}