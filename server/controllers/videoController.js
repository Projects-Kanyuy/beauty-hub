// controllers/videoController.js

const Video = require("../models/videoSchema");
const Interaction = require("../models/InteractionSchema");

// Helper to get real client IP
const getClientIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0] ||
  req.socket?.remoteAddress ||
  req.ip;


// 📤 Create Video
const createVideo = async (req, res) => {
  try {
    const { videoUrl, caption } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ message: "Video URL required" });
    }

    const video = await Video.create({ videoUrl, caption });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📥 Feed with Pagination
const getVideos = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;

    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ❤️ Like
const likeVideo = async (req, res) => {
  const { videoId, fingerprint } = req.body;
  const ip = getClientIp(req);

  try {
    await Interaction.create({
      video: videoId,
      type: "like",
      ip,
      fingerprint,
    });

    await Video.findByIdAndUpdate(videoId, {
      $inc: { likesCount: 1 },
    });

    res.json({ message: "Liked" });
  } catch (err) {
    res.status(400).json({ message: "Already liked" });
  }
};


// 💬 Comment
const commentVideo = async (req, res) => {
  const { videoId, text, name, fingerprint } = req.body;
  const ip = getClientIp(req);

  if (!name || !text) {
    return res.status(400).json({ message: "Name & text required" });
  }

  try {
    const comment = await Interaction.create({
      video: videoId,
      type: "comment",
      text,
      name,
      ip,
      fingerprint,
    });

    await Video.findByIdAndUpdate(videoId, {
      $inc: { commentsCount: 1 },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📄 Get Comments
const getComments = async (req, res) => {
  const { videoId } = req.params;

  try {
    const comments = await Interaction.find({
      video: videoId,
      type: "comment",
    }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔁 Share
const shareVideo = async (req, res) => {
  const { videoId } = req.body;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $inc: { sharesCount: 1 },
    });

    res.json({ message: "Shared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  createVideo,
  getVideos,
  likeVideo,
  commentVideo,
  getComments,
  shareVideo,
};