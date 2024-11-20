const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const readFile = require('../data/readData');
const writeFile = require('../data/writeData');
const authMiddleware = require('../middleware/authMiddleware');

// Тимчасовий масив для зберігання користувачів
const USERS_PATH = './src/data/users.json';
let users = readFile(USERS_PATH);

const REFRESH_TOKENS_PATH = './src/data/refreshTokens.json';
let refreshTokens = readFile(REFRESH_TOKENS_PATH);

const generateAccessToken = (user) => {
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '30m',
  });
  return accessToken;
}

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret', {
    expiresIn: '1d',
  });
  return refreshToken;
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, surname, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email, and password are required' });
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { id: users.length + 1, email, password: hashedPassword, name, surname, role };
    users.push(user);
    writeFile(USERS_PATH, users);

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email, and password are required' });
    }

    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken);
    writeFile(REFRESH_TOKENS_PATH, refreshTokens);

    res.status(200).json({ message: 'Login successful', accessToken, refreshToken});
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/refresh', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).json("Not authentificated!");

  if(!refreshTokens.includes(refreshToken)) return res.status(403).json("Refresh token is not valid.");

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret', (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);

    writeFile(REFRESH_TOKENS_PATH, refreshTokens);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    })
  });
});

router.post('/logout', authMiddleware, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  writeFile(REFRESH_TOKENS_PATH, refreshTokens);
  res.status(200).json("Logged out successfully.");
});

router.get('/users', (req, res) => {
  console.log('Route /users hit');
  res.json(users);
});

module.exports = router;
