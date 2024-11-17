const express = require('express');
const router = express.Router();

// Тимчасовий масив для зберігання користувачів
let users = [];

// Реєстрація користувача
router.post('/register', (req, res) => {
  console.log('Route /register hit'); // Для перевірки, чи маршрут викликається
  const { username, email, password } = req.body;

  // Перевірка заповнення обов'язкових полів
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  // Перевірка, чи email вже зареєстрований
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  // Додавання нового користувача
  const user = { id: users.length + 1, username, email, password };
  users.push(user);

  res.status(201).json({ message: 'User registered successfully', user });
});

// Отримання всіх користувачів (для тестування)
router.get('/users', (req, res) => {
  res.json(users);
});

module.exports = router;
