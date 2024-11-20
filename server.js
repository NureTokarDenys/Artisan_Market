const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authMiddleware = require('./src/middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./src/routes/productRoutes');
app.use('/api/products', productRoutes);

const profileRoutes = require('./src/routes/profileRoutes');
app.use('/api/profile', profileRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));