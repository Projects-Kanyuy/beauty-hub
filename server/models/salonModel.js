// server/models/salonModel.js
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
// We define the schema for a service as a sub-document
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: {
    type: String,
    enum: ["USD", "XAF"],
    default: "XAF",
  },
  duration: { type: Number }, // in minutes
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
      type: mongoose.Schema.Types.ObjectId, // A special type for referencing another document
      required: true,
      ref: "User", // This tells Mongoose the ObjectId refers to a document in the 'User' collection
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    photos: [{ type: String }], // An array of image URLs
    openingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
    },
    services: [serviceSchema], // An array of services, each following the serviceSchema
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
