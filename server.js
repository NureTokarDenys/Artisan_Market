const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const corsOptions = require('./src/options/corsOptions');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cookies
app.use(cookieParser());

// CORS
app.use(cors(corsOptions));

// Middleware 
app.use(express.json());

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}).catch((err) => console.error(err));

// Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./src/routes/productRoutes');
app.use('/api/products', productRoutes);

const profileRoutes = require('./src/routes/profileRoutes'); 
app.use('/api/profile', profileRoutes);

const s3Routes = require('./src/routes/s3Routes');
app.use('/api/s3', s3Routes);