const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const Users = await db.collection('Users').find().toArray();
    res.status(200).json(Users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Add a new user
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

    const newUser = {
      email,
      password,
      name,
      surname,
      role,
    };

    const db = await connectDB();
    const result = await db.collection('Users').insertOne(newUser);

    if (result.insertedId) {
      const insertedUser = await db.collection('Users').findOne({ _id: result.insertedId });

      const missingInsertedFields = requiredFields.filter(field => !(field in insertedUser));

      if (missingInsertedFields.length > 0) {
        return res.status(500).json({
          message: 'User inserted, but some fields are missing',
          missingFields: missingInsertedFields,
        });
      }

      res.status(201).json({
        message: 'User added successfully',
        user: insertedUser,
      });
    } else {
      res.status(500).json({ message: 'Failed to add user' });
    }
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
};



// Update a user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Перевірка валідності ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const db = await connectDB();

    // Оновлення лише переданих полів
    const updates = { ...req.body };

    // Якщо пароль оновлюється, хешувати його
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const result = await db.collection('Users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    // Якщо користувача не знайдено або оновлення не зроблене
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};



// Delete a user
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
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Генерація токена
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};