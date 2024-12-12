const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {getProfile, updateProfile } = require('../controllers/profileController'); 

router.get('/:id', authMiddleware, getProfile); 
router.post('/update/:id', authMiddleware, updateProfile);

module.exports = router;