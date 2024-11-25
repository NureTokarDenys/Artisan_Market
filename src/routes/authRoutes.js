const express = require('express');
const { getAllUsers, addUser, updateUser, deleteUser } = require('../controllers/authController');

const router = express.Router();

// Route для реєстрації користувача
router.post('/register', addUser);

// Інші маршрути
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
