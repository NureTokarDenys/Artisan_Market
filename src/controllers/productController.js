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

// Get all products of a specific user
exports.getUserProducts = async (req, res) => {
  const userId = req.params.id;
  try {
    const db = await connectDB();

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const products = await db.collection('Products').find({ userId: userId }).toArray();

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
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
  const id = req.params.id;
  try {
    const db = await connectDB();
    const result = await db.collection('Products').updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Hard delete a product
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await connectDB();
    const result = await db.collection('Products').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product ' + id});
  }
};

// Change product status
exports.changeProductStatus = async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.id; 

  try {
    const status = req.body.status;

    const db = await connectDB();

    const product = await db.collection('Products').findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.userId.toString() != userId) {
      return res.status(407).json({ error: 'You are not authorized to change the status of this product' });
    }

    const result = await db.collection('Products').updateOne(
      { _id: new ObjectId(productId) },
      { $set: { status } }
    );

    res.status(200).json({ message: 'Product status updated successfully', result });
  } catch (error) {
    console.error('Error changing product status:', error);
    res.status(500).json({ error: 'Failed to change status of the product' });
  }
};