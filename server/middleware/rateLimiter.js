

// middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const interactionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many actions, slow down",
});

module.exports = interactionLimiter
