const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: "XAF" },
  duration: { type: String }, 
  photos: { type: [String], default: [] },
  homeService: { type: Boolean, default: false },
  homeServiceFee: { type: Number, default: 0 },
});

const salonSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    slug: { type: String, unique: true }, // Clean URL field
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

// --- AUTO-GENERATE SLUG BEFORE SAVING ---
salonSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, "") // Remove special characters
      .replace(/ +/g, "-");    // Replace spaces with dashes
  }
  next();
});

module.exports = mongoose.model("Salon", salonSchema);