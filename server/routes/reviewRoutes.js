const express = require("express");
const router = express.Router({ mergeParams: true }); // Important to get salon ID
const { optionalProtect } = require("../middleware/authMiddleware");
const { addReview, getSalonReviews } = require("../controllers/reviewController");

router.route("/")
  .get(getSalonReviews)
  .post(optionalProtect, addReview);

module.exports = router;