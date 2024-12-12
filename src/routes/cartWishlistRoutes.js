const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {getCart, getWishlist, setCart, setWishlist} = require('../controllers/cartWishlistController'); 

router.get('/cart/:id', authMiddleware, getCart); 
router.get('/wishlist/:id', authMiddleware, getWishlist); 
router.post('/cart/:id', authMiddleware, setCart);
router.post('/wishlist/:id', authMiddleware, setWishlist); 

module.exports = router;