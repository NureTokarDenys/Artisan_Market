const express = require('express');
const router = express.Router();

// Тестовий маршрут
router.get('/', (req, res) => {
  res.send('User routes are working!');
});

module.exports = router;

