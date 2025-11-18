// server/controllers/reviewController.js
const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const Salon = require('../models/salonModel');

/**
 * @swagger
 * /api/salons/{id}/reviews:
 *   post:
 *     summary: Create a new review for a salon (Customer only)
 *     description: Allows an authenticated customer to leave a rating and comment on a salon. A user can only review a salon once. Automatically updates the salon's average rating.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Amazing service! The stylist was super professional and my braids lasted for weeks."
 *     responses:
 *       201:
 *         description: Review successfully added and salon average rating updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review added"
 *       400:
 *         description: Already reviewed this salon
 *       404:
 *         description: Salon not found
 *       401:
 *         description: Not authenticated
 */
const createSalonReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }

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

  salon.reviews.push(review._id);

  // Recalculate average rating
  const reviews = await Review.find({ salon: req.params.id });
  salon.averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await salon.save();
  res.status(201).json({ message: 'Review added' });
});

/**
 * @swagger
 * /api/salons/{id}/reviews:
 *   get:
 *     summary: Get all reviews for a specific salon
 *     description: Returns all customer reviews for the salon, including reviewer's name. Public endpoint — no authentication required.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: List of reviews with user names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
const getSalonReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ salon: req.params.id }).populate('user', 'name');
  res.json(reviews);
});

/**
 * @swagger
 * /api/reviews/{id}/reply:
 *   post:
 *     summary: Add a reply to a review (Salon Owner only)
 *     description: Allows the salon owner to respond publicly to a customer review.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - replyText
 *             properties:
 *               replyText:
 *                 type: string
 *                 example: "Thank you so much for your kind words! We're thrilled you loved your braids ❤️ Can't wait to see you again!"
 *     responses:
 *       200:
 *         description: Reply added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       401:
 *         description: Not authorized (not the salon owner)
 *       404:
 *         description: Review not found
 */
const addReviewReply = asyncHandler(async (req, res) => {
  const { replyText } = req.body;
  const review = await Review.findById(req.params.id).populate('salon');

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to reply to this review');
  }

  review.reply = replyText;
  await review.save();

  res.json(review);
});

module.exports = { createSalonReview, getSalonReviews, addReviewReply };
