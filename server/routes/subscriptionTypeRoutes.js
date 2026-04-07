// server/routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

const {
  getSubscriptionTypes,
  createSubscriptionType,
  updateSubscriptionType,
  deleteSubscriptionType,
  getSubscriptionTypeById,
  getPlanBySlug
} = require("../controllers/subscriptionTypeController");

// Public
router.get("/", getSubscriptionTypes);

router.get("/:id", getSubscriptionTypeById);

// Admin only
router.post("/", protect, admin, createSubscriptionType);
router.get("/slug/:slug", getPlanBySlug);
router.put("/:id", protect, admin, updateSubscriptionType);
router.delete("/:id", protect, admin, deleteSubscriptionType);


module.exports = router;
