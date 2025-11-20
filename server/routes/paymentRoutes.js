// routes/paymentRoutes.js
const express = require('express');
const initiateSwychrPayment = require('../controllers/paymentController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/initiate-swychr', protect, initiateSwychrPayment);

module.exports = router;
