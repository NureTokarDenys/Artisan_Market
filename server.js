const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// CORS
const whitelist = ['http://localhost:3000', 'http://127.0.0.1:3000', "http://localhost:5000/"];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.error(`Blocked by CORS: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
    credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
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