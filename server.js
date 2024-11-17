const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const productRoutes = require('./src/routes/productRoutes');
app.use('/api/products', productRoutes);
