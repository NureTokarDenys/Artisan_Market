const express = require('express');
const router = express.Router();

// Тимчасовий масив продуктів
let products = [];

// Додати продукт
router.post('/', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }
  const product = { id: products.length + 1, name, price };
  products.push(product);
  res.status(201).json({ message: 'Product added', product });
});

// Отримати всі продукти
router.get('/', (req, res) => {
  res.json(products);
});

module.exports = router;
