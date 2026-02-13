// models/transactionModel.js
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - transactionId
 *         - user
 *         - amount
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         transactionId:
 *           type: string
 *           description: Unique reference sent to Swychr
 *         user:
 *           type: string
 *           ref: User
 *         plan:
 *           type: string
 *           ref: SubscriptionType
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *           default: XAF
 *         status:
 *           type: string
 *           enum: [PENDING, LINK_CREATED, PAID, FAILED, CANCELLED]
 *           default: PENDING
 *         paymentUrl:
 *           type: string
 *         customerName:
 *           type: string
 *         customerEmail:
 *           type: string
 *         customerPhone:
 *           type: string
 *         countryCode:
 *           type: string
 *           default: CM
 *         description:
 *           type: string
 *         gateway:
 *           type: string
 *           default: swychr
 *         salonDetails:
 *           type: object
 *           description: User-provided salon information for auto-creation on success
 *           properties:
 *             name:
 *               type: string
 *               example: Glamour Beauty Palace
 *             description:
 *               type: string
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             phone:
 *               type: string
 *             openingHours:
 *               type: object
 *               additionalProperties: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionType' },
  amount: { type: Number, required: true },
    currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  status: { type: String, enum: ['PENDING', 'LINK_CREATED', 'PAID', 'FAILED', 'CANCELLED'], default: 'PENDING' },
  paymentUrl: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  countryCode: { type: String, default: 'US' },
  description: String,
  gateway: { type: String, default: 'swychr' },

  // ← NEW: User-filled salon details
  salonDetails: {
    name: String,
    description: String,
    address: String,
    city: String,
    phone: String,
    openingHours: mongoose.Schema.Types.Mixed,
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
