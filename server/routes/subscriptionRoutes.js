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
  getConvertedPrice,
  publicSubscribe
} = require("../controllers/subscriptionController");

router
  .route("/:userId/subscription-history")
  .get(protect, getMySubscriptionHistory);

router.route("/subscribe").post(protect, subscribe);
router.post("/public-subscribe", publicSubscribe);
router.get("/public-price/:planId/:countryCode", getConvertedPrice);

router
  .route("/:userId/get-active-subscription")
  .get(protect, getActiveSubscription);
router.route("/redeem-coupon-code").post(protect, redeemCouponCode);

// only admin can create a coupon code
router.route("/create-coupon-code").post(protect, admin, createCouponCode);
router.get("/price/:planId/:countryCode", protect, getConvertedPrice);

module.exports = router;
