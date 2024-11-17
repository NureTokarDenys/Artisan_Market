const Product = require('../models/Product');

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      createdBy: req.user.id,
    });
    await product.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
