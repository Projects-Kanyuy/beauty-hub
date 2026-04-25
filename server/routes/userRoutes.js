// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  updateUserProfile,
  verifyEmail,
  resendVerification,
  selfResetPassword
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
// When a POST request comes to '/', use the registerUser controller
router.route("/").post(registerUser);

// When a POST request comes to '/login', use the authUser controller
router.post("/login", authUser);
router.route("/profile").put(protect, updateUserProfile);
router.get("/verify/:token", verifyEmail);
router.post("/verify/resend", resendVerification);
router.put("/self-reset-password", selfResetPassword);
module.exports = router;
