const { connectDB } = require('../config/db');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('users').insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
