import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import CurrencyConverter from './Components/Currency/Currency';
import ExchangeRatesMarquee from './Components/ExchangeRatesMArque/ExchangeRatesMArque';
import PriceList from './Components/PriceList/PriceList';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ExchangeRatesMarquee/>
    <CurrencyConverter/>
    <PriceList/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

