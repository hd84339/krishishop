const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

// Admin routes
router.get('/', protect, getAllOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
