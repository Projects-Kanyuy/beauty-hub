// server/models/subscriptionTypeModel.js
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionType:
 *       type: object
 *       required:
 *         - planName
 *         - planSpecs
 *         - amount
 *         - durationMonths
 *       properties:
 *         _id:
 *           type: string
 *         planName:
 *           type: string
 *           enum: [Basic, Pro, Premium]
 *           example: "Pro"
 *         planSpecs:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Unlimited appointments", "Priority booking", "Analytics dashboard", "Featured listing"]
 *         amount:
 *           type: number
 *           example: 49900  // in your currency's smallest unit (e.g., cents or NGN kobo)
 *         durationMonths:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         createdBy:
 *           type: string
 *           description: Admin user ID who created it
 *         updatedBy:
 *           type: string
 *           description: Admin user ID who last updated it
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const subscriptionTypeSchema = mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      enum: ['Basic', 'Pro', 'Premium'],
      unique: true,
    },
    planSpecs: {
      type: [String],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    durationMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const SubscriptionType = mongoose.model('SubscriptionType', subscriptionTypeSchema);

module.exports = SubscriptionType;
