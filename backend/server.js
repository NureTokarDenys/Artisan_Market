const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Для обробки JSON у запитах

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Маршрути
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Тестовий маршрут
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
