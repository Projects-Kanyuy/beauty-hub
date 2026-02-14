// server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // Important: mergeParams allows us to get :id from the salon router
const { createSalonReview,getSalonReviews, addReviewReply } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createSalonReview)
  .get(getSalonReviews);
router.route('/:reviewId/reply').put(protect, addReviewReply);
module.exports = router;
