const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {getCart, getWishlist, setCart, setWishlist, getUserInfo} = require('../controllers/cartWishlistController'); 

router.get('/cart/:id', authMiddleware, getCart); 
router.get('/wishlist/:id', authMiddleware, getWishlist); 
router.post('/cart/:id', authMiddleware, setCart);
router.post('/wishlist/:id', authMiddleware, setWishlist);

router.get('/userinfo/:id', authMiddleware, getUserInfo);

module.exports = router;