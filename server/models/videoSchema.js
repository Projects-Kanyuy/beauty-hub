const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
    videoUrl: {
      type: String, // Cloudinary URL
      required: true,
    },
    caption: String,

    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
