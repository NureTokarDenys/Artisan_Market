<<<<<<< HEAD
<<<<<<< HEAD
const express = require('express')

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("be init");
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
}); 
=======
=======
>>>>>>> 045c9402551c54f9184ba69f7287487512087f7f
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
<<<<<<< HEAD
>>>>>>> d49897f (fe init)
=======
>>>>>>> 045c9402551c54f9184ba69f7287487512087f7f
