const express = require('express');
const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getUserProducts,
  changeProductStatus
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', authMiddleware, authorizeRoles(['seller']), addProduct);
router.put('/:id', authMiddleware, authorizeRoles(['seller']), updateProduct);
router.delete('/:id', authMiddleware, authorizeRoles(['seller']), deleteProduct);

router.get("/user/:id", authMiddleware, getUserProducts);
router.post('/status/:id', authMiddleware, authorizeRoles(['seller']), changeProductStatus);

module.exports = router;
