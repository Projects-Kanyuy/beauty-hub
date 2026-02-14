const express = require("express");
const router = express.Router();
const { addReviewReply } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.route("/:reviewId/reply").put(protect, addReviewReply);

module.exports = router;
