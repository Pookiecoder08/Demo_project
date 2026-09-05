import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SOCProvider } from './context/SOCContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SOCProvider>
      <App />
    </SOCProvider>
  </React.StrictMode>
);
