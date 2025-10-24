// server/controllers/reviewController.js
const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const Salon = require('../models/salonModel');

// @desc    Create a new review
// @route   POST /api/salons/:id/reviews
// @access  Private (Customer only)
const createSalonReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const salon = await Salon.findById(req.params.id);

  if (salon) {
    // Check if the user has already reviewed this salon
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      salon: req.params.id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Salon already reviewed');
    }

    const review = await Review.create({
      rating: Number(rating),
      comment,
      user: req.user._id,
      salon: req.params.id,
    });

    // Update the salon's reviews array
    salon.reviews.push(review._id);

    // Recalculate the average rating
    // This is a simple but effective approach
    const reviews = await Review.find({ salon: req.params.id });
    salon.averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await salon.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Salon not found');
  }
});
const getSalonReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ salon: req.params.id }).populate('user', 'name');
  res.json(reviews);
});
const addReviewReply = asyncHandler(async (req, res) => {
  const { replyText } = req.body;
  const review = await Review.findById(req.params.id).populate('salon');

  if (!review) {
    res.status(404); throw new Error('Review not found');
  }

  // Authorization: Check if logged-in user owns the salon this review is for
  if (review.salon.owner.toString() !== req.user._id.toString()) {
    res.status(401); throw new Error('Not authorized to reply to this review');
  }

  review.reply = replyText;
  await review.save();

  res.json(review);
});

module.exports = { createSalonReview, getSalonReviews,addReviewReply };