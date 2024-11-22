const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const readFile = require('../data/readData');
const writeFile = require('../data/writeData');
const authMiddleware = require('../middleware/authMiddleware');
const cookieOptions = require('../options/cookieOptions');

// File paths for data storage
const USERS_PATH = './src/data/users.json';
const REFRESH_TOKENS_PATH = './src/data/refreshTokens.json';

// Load initial data
let users = readFile(USERS_PATH);
let refreshTokens = readFile(REFRESH_TOKENS_PATH);

// Token generation functions
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '3s' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    { expiresIn: '7d' }
  );
};

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, surname, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      surname,
      role: role || '1',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeFile(USERS_PATH, users);

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: newUser.id 
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token
    const tokenObj = {
      token: refreshToken,
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    refreshTokens.push(tokenObj);
    writeFile(REFRESH_TOKENS_PATH, refreshTokens);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, cookieOptions);

    console.log("AccessToken: " + accessToken);
    console.log("RefreshToken: " + refreshToken);

    // Send access token in response body
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      userId: user.id
      
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token endpoint
router.post('/refresh', (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Refresh token: " +  refreshToken);

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    // Verify if refresh token exists in storage
    const storedToken = refreshTokens.find(t => t.token === refreshToken);
    if (!storedToken) {
      // If the refresh token is not found, we can clear it, as it's invalid
      res.clearCookie('refreshToken', cookieOptions);
      return res.status(405).json({ message: 'Invalid refresh token' });
    }

    // Verify the refresh token with JWT
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'default_refresh_secret', (err, decoded) => {
      if (err) {
        // If verification fails, clear the refresh token and inform the client
        res.clearCookie('refreshToken', cookieOptions);
        console.log("Removed invalid refresh token: " + refreshToken);
        refreshTokens = refreshTokens.filter(t => t.token !== refreshToken);
        writeFile(REFRESH_TOKENS_PATH, refreshTokens);
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const user = users.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      // Remove old refresh token and add the new one
      refreshTokens = refreshTokens.filter(t => t.token !== refreshToken);
      refreshTokens.push({
        token: newRefreshToken,
        userId: user.id,
        createdAt: new Date().toISOString()
      });
      writeFile(REFRESH_TOKENS_PATH, refreshTokens);

      // Set the new refresh token as HTTP-only cookie
      res.cookie('refreshToken', newRefreshToken, cookieOptions);
      console.log("Set new refresh token cookie: " + newRefreshToken);

      // Send the new access token
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error('Error in refresh token:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout endpoint
router.post('/logout', authMiddleware, (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      refreshTokens = refreshTokens.filter(t => t.token !== refreshToken);
      writeFile(REFRESH_TOKENS_PATH, refreshTokens);
    }

    res.clearCookie('refreshToken', cookieOptions);
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/status', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
      return res.json({ authenticated: false });
  }

  try {
      const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const newAccessToken = generateAccessToken(user);
      res.status(200).json({ authenticated: true, userId: user.id, accessToken: newAccessToken });
  } catch (err) {
      res.status(401).json({ authenticated: false });
  }
});

module.exports = router;