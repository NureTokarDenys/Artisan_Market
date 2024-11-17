const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Реєстрація користувача
exports.registerUser = async (req, res) => {
    try {
      console.log('Request Body:', req.body); // Лог для перевірки тіла запиту
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      console.error('Error in registerUser:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// Вхід користувача
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Перевірка, чи існує користувач
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Перевірка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Генерація JWT токена
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
