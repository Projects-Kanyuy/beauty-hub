// routes/subscriptionroutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMySubscriptionHistory,
  subscribe,
  getActiveSubscription,
} = require("../controllers/subscriptionController");

router
  .route("/:userId/subscription-history")
  .get(protect, getMySubscriptionHistory);

router.route("/subscribe").post(protect, subscribe);

router.route("/:userId/get-active-subscription").get(getActiveSubscription);

module.exports = router;
