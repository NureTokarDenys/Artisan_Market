const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.get('/', (req, res) => {
    res.send('Auth routes are working!');
  });
  
// Реєстрація
router.post('/register', registerUser);

// Вхід
router.post('/login', loginUser);

module.exports = router;
