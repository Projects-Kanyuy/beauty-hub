




const express = require("express");

const {
 createVideo,
     getVideos,
  likeVideo,
  commentVideo,
  getComments,
  shareVideo,
} = require("../controllers/videoController");
const interactionLimiter = require("../middleware/rateLimiter").interactionLimiter;

const router = express.Router();

router.post("/", createVideo);
router.get("/", getVideos);

router.post("/like", interactionLimiter, likeVideo);
router.post("/comment", interactionLimiter, commentVideo);

router.get("/:videoId/comments", getComments);

router.post("/share", shareVideo);


module.exports = router;