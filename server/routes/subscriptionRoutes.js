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

router
  .route("/:userId/subscription-history")
  .get(protect, getMySubscriptionHistory);

router.route("/subscribe").post(protect, subscribe);

router.route("/:userId/get-active-subscription").get(getActiveSubscription);
router.route("/redeem-coupon-code").post(protect, redeemCouponCode);

// only admin can create a coupon code
router.route("/create-coupon-code").post(protect, admin, createCouponCode);

module.exports = router;
