const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieOptions = require('../options/cookieOptions');

// Token generation functions
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '3s' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    { expiresIn: '7d' }
  );
};

exports.getAllUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const Users = await db.collection('Users').find().toArray();
    res.status(200).json(Users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { email, password, name, surname, role } = req.body;

    const requiredFields = ['email', 'password', 'name', 'surname', 'role'];
    const missingFields = requiredFields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields,
      });
    }

    const db = await connectDB();
    const Users = db.collection('Users');
    
    const emailAlreadyExists = await Users.findOne({ email });
    if(emailAlreadyExists){
      res.status(409).json({ message: 'Email already exists' });
    }

    hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      name,
      surname,
      role,
      createdAt: new Date().toISOString()
    };


    const result = await Users.insertOne(newUser);

    if (!result.insertedId)  {
      res.status(500).json({ message: 'Database failed to add user' });
    }else {
      res.status(201).json({ 
        message: 'User registered successfully',
        userId: result.insertedId 
      });
    }
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Server failed to add user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const db = await connectDB();

    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const result = await db.collection('Users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const db = await connectDB();
    const result = await db.collection('Users').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = await connectDB();
    const user = await db.collection('Users').findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const tokenObj = {
      refreshToken: refreshToken,
      userId: user._id
    };
    const tokenResult = await db.collection("Refresh_tokens").insertOne(tokenObj);
    if(!tokenResult){
      res.status(500).json({ message: 'Failed to save refresh token in the database' });
    }

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.refreshUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const db = await connectDB();
    const storedToken = await db.collection('Refresh_tokens').findOne({ refreshToken });

    if (!storedToken) {
      res.clearCookie('refreshToken', cookieOptions);
      return res.status(405).json({ message: 'Invalid refresh token' });
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
        (err, decodedToken) => {
          if (err) reject(err);
          else resolve(decodedToken);
        }
      );
    });
    console.log("decoded = " + decoded);
    const user = await db.collection('Users').findOne({ _id: new ObjectId(decoded.id) });
    console.log("user = " + user);
    if (!user) {
      res.clearCookie('refreshToken', cookieOptions);
      return res.status(403).json({ message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await db.collection('Refresh_tokens').deleteOne({ refreshToken });
    await db.collection('Refresh_tokens').insertOne({
      refreshToken: newRefreshToken,
      userId: user._id,
    });

    res.cookie('refreshToken', newRefreshToken, cookieOptions);
    console.log("Set new refresh token cookie: " + newRefreshToken);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.clearCookie('refreshToken', cookieOptions);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const db = await connectDB();

    if (refreshToken) {
      await db.collection('Refresh_tokens').deleteOne({ refreshToken });
    }
    res.clearCookie('refreshToken', cookieOptions);
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getUserStatus = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
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
};