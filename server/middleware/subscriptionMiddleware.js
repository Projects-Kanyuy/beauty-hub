const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");

const requireActiveSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const isAdmin = req.user?.role === "admin";

  // 1. ADMINISTRATIVE OVERRIDE
  // If the requester is an admin, let them bypass the subscription check
  if (isAdmin) {
    return next();
  }

  // 2. REGULAR USER CHECK
  const activeSub = await Subscription.getActiveSubscription(userId);

  if (!activeSub) {
    res.status(403);
    throw new Error("Active subscription required. Please contact admin for manual activation.");
  }

  req.subscription = activeSub;
  next();
});

module.exports = { requireActiveSubscription };