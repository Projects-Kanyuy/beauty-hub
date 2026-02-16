const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Salon:
 *       type: object
 *       properties:
 *         _idId:
 *           type: string
 *         owner:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         phone:
 *           type: string
 *         currency:
 *           type: string
 *           description: The base currency for this salon's services (e.g., XAF, USD)
 *           example: XAF
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *         openingHours:
 *           type: object
 *           additionalProperties:
 *             type: string
 *         services:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               currency:
 *                 type: string
 *               duration:
 *                 type: string
 *         averageRating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         reviews:
 *           type: array
 *           items:
 *             type: string
 */

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: {
    type: String,
    // We keep this flexible so a specific service could theoretically 
    // differ, but it will default to the Salon's currency.
    default: "XAF",
  },
  duration: { type: String }, // Switched to string to allow "1h 30m" format
  homeService: {
    type: Boolean,
    default: false,
  },
  homeServiceFee: {
    type: Number,
    default: 0,
  },
});

const salonSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // --- ADDED THIS FIELD ---
    currency: {
      type: String,
      default: "XAF",
      // List of supported currencies from your provided spreadsheet
      enum: ["XAF", "XOF", "NGN", "GHS", "USD", "KES", "TZS", "UGX", "ZMW", "INR"],
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    photos: [{ type: String }],
    openingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
    services: [serviceSchema],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Salon = mongoose.model("Salon", salonSchema);

module.exports = Salon;