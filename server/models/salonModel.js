const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: {
    type: String,
    default: "XAF",
  },
  duration: { type: String }, 
  photos: { type: [String], default: [] }, // --- NEW FIELD FOR SERVICE IMAGES ---
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
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    currency: {
      type: String,
      default: "XAF",
      enum: ["XAF", "XOF", "NGN", "GHS", "USD", "KES", "TZS", "UGX", "ZMW", "INR"],
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    photos: [{ type: String }],
    openingHours: {
      monday: String, tuesday: String, wednesday: String, thursday: String, 
      friday: String, saturday: String, sunday: String,
    },
    services: [serviceSchema], 
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    averageRating: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salon", salonSchema);