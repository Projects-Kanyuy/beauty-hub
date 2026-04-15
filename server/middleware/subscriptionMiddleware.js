const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");

const requireActiveSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const isAdmin = req.user?.role === "admin";
  
  // 1. ADMINISTRATIVE OVERRIDE
  // If the user is an admin OR if the owner has been manually verified/activated
  // (Assuming 'isVerified' is the field your admin override toggles)
  if (isAdmin || req.user?.isVerified === true) {
    return next();
  }

  // 2. REGULAR USER CHECK
  // This looks for a document in the Subscriptions collection
  const activeSub = await Subscription.getActiveSubscription(userId);

  if (!activeSub) {
    res.status(403);
    throw new Error("Active subscription required. Please contact admin for manual activation.");
  }

  req.subscription = activeSub;
  next();
});

module.exports = { requireActiveSubscription };