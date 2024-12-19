const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder, getBuyerOrders, getSellerOrders, changeOrderStatus } = require('../controllers/orderController'); 

router.post("/create", authMiddleware, createOrder);
router.get("/buyer/:id", getBuyerOrders);
router.get("/seller/:id", getSellerOrders);
router.post("/status/:id", changeOrderStatus);

module.exports = router;