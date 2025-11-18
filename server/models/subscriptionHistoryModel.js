// server/models/subscriptionHistoryModel.js
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionHistory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         salon:
 *           type: string
 *           ref: Salon
 *         planName:
 *           type: string
 *           example: "Pro"
 *         amount:
 *           type: number
 *           example: 49900
 *         durationMonths:
 *           type: integer
 *           example: 1
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [Active, Expired, Cancelled, Pending]
 *           default: Active
 *         paymentRef:
 *           type: string
 *           description: Optional payment gateway reference
 *         createdAt:
 *           type: string
 *           format: date-time
 */

const subscriptionHistorySchema = mongoose.Schema(
  {
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    durationMonths: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Cancelled', 'Pending'],
      default: 'Active',
    },
    paymentRef: {
      type: String,
    },
  },
  { timestamps: true }
);

const SubscriptionHistory = mongoose.model('SubscriptionHistory', subscriptionHistorySchema);

module.exports = SubscriptionHistory;
