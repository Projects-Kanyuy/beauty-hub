// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { checkPaymentStatus } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.route("/:id/check-payment-status").get(protect, checkPaymentStatus);

module.exports = router;
