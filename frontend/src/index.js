import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HelmetProvider} from 'react-helmet-async';
import { StoreProvider } from './context/store.context';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <StoreProvider>
      <HelmetProvider>
         <PayPalScriptProvider deferLoading={true}> {/* set deferLoading to true; we dont want to load Paypay at the beggining */}
           <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
