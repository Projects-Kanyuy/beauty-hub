// server/models/reviewModel.js
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         salon:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         reply:
 *           type: string
 *           nullable: true
 *           description: Salon owner's public response (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "66789abc123def456789abcd"
 *         user:
 *           _id: "66789abc123def456789abcf"
 *           name: "Jennifer M."
 *         rating: 5
 *         comment: "Best salon experience ever! Highly recommend."
 *         reply: "Thank you Jennifer! It was a pleasure having you ✨"
 *         createdAt: "2025-11-10T14:30:00.000Z"
 */
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Salon',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
