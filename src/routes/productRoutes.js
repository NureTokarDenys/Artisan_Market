const express = require('express');
const router = express.Router();
const readFile = require('../data/readData');
const writeFile = require('../data/writeData');
const authMiddleware = require('../middleware/authMiddleware');

// Тимчасовий масив продуктів
const DATA_PATH = './src/data/products.json';
let products = readFile(DATA_PATH);

// Додати продукт
router.post('/', authMiddleware, (req, res) => {
  const { name, price, description, rating, totalRatings, quantity, images, colors } = req.body;
  if (!name || !price || !description) {
    return res.status(400).json({ message: 'Name, price and description are required' });
  }
  const product = { id: products.length + 1, name, price, description, rating, totalRatings, quantity, images, colors };
  products.push(product);
  writeFile(DATA_PATH, products);

  res.status(201).json({ message: 'Product added', product });
});

// Отримати всі продукти
router.get('/', (req, res) => {
  res.json(products);
});

module.exports = router;
