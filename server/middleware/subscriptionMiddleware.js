const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");

const requireActiveSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;
  const isAdmin = req.user?.role === "admin";
  
  // 1. ADMINISTRATIVE BYPASS
  // Admins are never blocked.
  if (isAdmin) {
    return next();
  }

  // 2. FETCH SUBSCRIPTION STATUS
  const activeSub = await Subscription.getActiveSubscription(userId);

  // 3. CHECK FOR RESTRICTION (SUSPENSION)
  // If a record exists but the admin set it to "Suspended"
  if (activeSub && activeSub.status === "Suspended") {
    res.status(403);
    throw new Error("Your account has been suspended by an administrator. Please contact support.");
  }

  // 4. MANUAL OVERRIDE CHECK
  // We check this AFTER the suspension check so that even verified users 
  // can be blocked if you decide to suspend them later.
  if (req.user?.isVerified === true) {
    return next();
  }

  // 5. REGULAR EXPIRATION/MISSING CHECK
  if (!activeSub || activeSub.status !== "Active") {
    res.status(403);
    throw new Error("Active subscription required. Please choose a plan to continue.");
  }

  req.subscription = activeSub;
  next();
});

module.exports = { requireActiveSubscription };