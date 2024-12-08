const express = require('express');
const { addUser, updateUser, deleteUser, loginUser, refreshUser, logoutUser, getUserStatus } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', addUser);
router.post('/login', loginUser);

router.post('/refresh', refreshUser);
router.get('/status', getUserStatus);
router.post('/logout', authMiddleware, logoutUser);

router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);



module.exports = router;
