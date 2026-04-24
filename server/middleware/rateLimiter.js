// middleware/rateLimiter.js
import rateLimit from "express-rate-limit";



export const interactionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 30,
  message: "Too many actions, slow down",
});