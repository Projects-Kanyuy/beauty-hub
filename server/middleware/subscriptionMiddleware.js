// server/middleware/subscriptionMiddleware.js
const asyncHandler = require('express-async-handler');
const SubscriptionHistory = require('../models/subscriptionHistoryModel');

const requireActiveSubscription = asyncHandler(async (req, res, next) => {
  const salon = await Salon.findOne({ owner: req.user._id });
  if (!salon) return next(); // No salon yet → allow (they're creating one)

  const activeSub = await SubscriptionHistory.findOne({
    salon: salon._id,
    status: 'Active',
    endDate: { $gt: new Date() },
  });

  if (!activeSub) {
    res.status(403);
    throw new Error('Active subscription required to access salon features');
  }

  req.subscription = activeSub;
  next();
});

module.exports = { requireActiveSubscription };
