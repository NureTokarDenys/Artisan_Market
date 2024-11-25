const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./src/config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Підключення до MongoDB
connectDB().then(() => {
  // Запуск сервера після успішного підключення до MongoDB
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}).catch((err) => console.error(err));

// Маршрути
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./src/routes/productRoutes');
app.use('/api/products', productRoutes);
