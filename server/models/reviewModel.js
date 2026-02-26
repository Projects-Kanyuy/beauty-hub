const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // Remove 'required: true' so guests can leave reviews
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }, 
    // Add this to store the name of people who aren't logged in
    guestName: { 
      type: String 
    },
    salon: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Salon", 
      required: true 
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);