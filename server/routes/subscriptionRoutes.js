// routes/subscriptionroutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getMySubscriptionHistory,
  subscribe,
  getActiveSubscription,
  createCouponCode,
  redeemCouponCode,
} = require("../controllers/subscriptionController");
const { login, getFiatRate } = require("../services/swychrService");
router
  .route("/:userId/subscription-history")
  .get(protect, getMySubscriptionHistory);

router.route("/subscribe").post(protect, subscribe);

router
  .route("/:userId/get-active-subscription")
  .get(protect, getActiveSubscription);
router.route("/redeem-coupon-code").post(protect, redeemCouponCode);

// only admin can create a coupon code
router.route("/create-coupon-code").post(protect, admin, createCouponCode);

router.get("/get-rate/:countryCode", protect, async (req, res) => {
  console.log("--- ROUTE START ---");
  try {
    const { login, getFiatRate } = require("../services/swychrService");
    const token = await login();
    
    // Request the rate for $1
    const actualValueFromSwychr = await getFiatRate(token, req.params.countryCode, 1);
    
    console.log("REAL VALUE TO SEND:", actualValueFromSwychr);
    
    res.json({ 
      success: true, 
      rate: actualValueFromSwychr // NO MORE 615 HERE
    });
  } catch (error) {
    res.json({ success: false, rate: 615 });
  }
});
module.exports = router;
