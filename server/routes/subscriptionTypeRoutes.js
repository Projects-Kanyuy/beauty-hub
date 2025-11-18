// server/routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

const {
  getSubscriptionTypes,
  createSubscriptionType,
  updateSubscriptionType,
  deleteSubscriptionType,
} = require('../controllers/subscriptionTypeController');

// Public
router.get('/types', getSubscriptionTypes);

// Admin only
router.post('/types', protect, admin, createSubscriptionType);
router.put('/types/:id', protect, admin, updateSubscriptionType);
router.delete('/types/:id', protect, admin, deleteSubscriptionType);

module.exports = router;