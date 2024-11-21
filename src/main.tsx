import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import CurrencyConverter from './Components/Currency/Currency';
import ExchangeRatesMarquee from './Components/ExchangeRatesMArque/ExchangeRatesMArque';
import PriceList from './Components/PriceList/PriceList';
import History from './Components/History/History';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ExchangeRatesMarquee/>
    <CurrencyConverter/>
    <PriceList/>
    <History/>
  </React.StrictMode>
);



