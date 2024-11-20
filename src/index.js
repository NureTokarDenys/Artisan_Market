import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './helpers/AuthContext';
import { PopupProvider } from './helpers/PopUpProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
          <PopupProvider>
            <App />
          </PopupProvider>
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);