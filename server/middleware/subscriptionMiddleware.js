// server/middleware/subscriptionMiddleware.js
const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");
// const Salon = require("../models/salonModel");

const requireActiveSubscription = asyncHandler(async (req, res, next) => {
  // const salon = await Salon.findOne({ owner: req.user._id });
  // if (!salon) return next(); // No salon yet → allow (they're creating one)
  const userId = req.user?._id;
  const activeSub = await Subscription.getActiveSubscription(userId);

  if (!activeSub) {
    res.status(403);
    throw new Error("Active subscription required to access salon features");
  }

  req.subscription = activeSub;
  next();
});

module.exports = { requireActiveSubscription };
