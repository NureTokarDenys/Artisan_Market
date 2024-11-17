const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// User Registration
let users = [];

exports.registerUser = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Лог для перевірки тіла запиту

    const { username, email, password } = req.body;

    // Перевірка, чи всі поля заповнені
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Перевірка, чи email вже існує
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
    const user = { id: users.length + 1, username, email, password: hashedPassword };
    users.push(user);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
// User Login
exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Знаходимо користувача в масиві
      const user = users.find((user) => user.email === email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Перевірка пароля
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Генерація токена
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: '1h',
      });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error in loginUser:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
      const { username, email } = req.body;
  
      // Знаходимо користувача
      const user = users.find((user) => user.id === req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Оновлення даних
      user.username = username || user.username;
      user.email = email || user.email;
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  