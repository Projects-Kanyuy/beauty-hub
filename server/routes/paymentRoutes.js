// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { initiateSwychrPayment, swychrWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/initiate-swychr', protect, initiateSwychrPayment);
router.post('/swychr/webhook', express.json(), swychrWebhook); // no auth needed

module.exports = router;
