const mongoose = require("mongoose");
const interactionSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    type: {
      type: String,
      enum: ["like", "comment"],
      required: true,
    },

    name: String, // required for comments
    text: String, // comment text

    ip: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate likes per IP
interactionSchema.index(
  { video: 1, type: 1, ip: 1 },
  { unique: true, partialFilterExpression: { type: "like" } }
);

module.exports = mongoose.model("Interaction", interactionSchema);