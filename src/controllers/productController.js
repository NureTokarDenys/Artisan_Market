const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.collection('Products').find().toArray();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('Products').insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const result = await db.collection('Products').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const result = await db.collection('Products').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
