// server/controllers/reviewController.js
const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");
const Salon = require("../models/salonModel");

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment, guestName } = req.body;
  const salonId = req.params.id;

  // 1. Prepare data
  const reviewData = {
    salon: salonId,
    rating: Number(rating),
    comment: comment,
  };

  // 2. Logic for Logged-in vs Guest
  if (req.user) {
    reviewData.user = req.user._id;
  } else {
    reviewData.guestName = guestName || "Anonymous Client";
  }

  // 3. Save to Database
  const review = await Review.create(reviewData);

  // 4. Link Review to Salon and update average
  const salon = await Salon.findById(salonId);
  salon.reviews.push(review._id);

  const allReviews = await Review.find({ salon: salonId });
  const totalRating = allReviews.reduce((acc, item) => item.rating + acc, 0);
  salon.averageRating = totalRating / allReviews.length;

  await salon.save();

  res.status(201).json({ success: true, review });
});

// @desc    Get reviews for a salon
const getSalonReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ salon: req.params.id })
    .populate("user", "name") // Fills in the name for registered users
    .sort("-createdAt");
  res.json(reviews);
});

module.exports = { addReview, getSalonReviews };