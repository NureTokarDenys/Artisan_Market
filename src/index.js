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
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
>>>>>>> d49897f (fe init)
