const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder, getBuyerOrders, getSellerOrders, changeOrderStatus } = require('../controllers/orderController'); 

router.post("/create", authMiddleware, createOrder);
router.get("/buyer/:id", authMiddleware, getBuyerOrders);
router.get("/seller/:id", authMiddleware, getSellerOrders);
router.post("/status/:id", authMiddleware, changeOrderStatus);

module.exports = router;