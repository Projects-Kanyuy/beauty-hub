// server/routes/salonRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSalons,
  getSalonById,
  createSalon,
  updateSalon,
  addSalonService,
  updateSalonService,
  deleteSalonService,
  getMySalon,
  getSalonBySlug,
  searchSalonsByService
} = require("../controllers/salonController");
const { protect } = require("../middleware/authMiddleware");
const reviewRouter = require("./reviewRoutes");
const {
  requireActiveSubscription,
} = require("../middleware/subscriptionMiddleware");
const cacheMiddleware = require("../middleware/cache");

// --- CORRECTED ROUTE ORDER ---

// Public route to get all salons
router.use("/search", searchSalonsByService)
router.route("/", cacheMiddleware(120),).get(getSalons);
router.get("/s/:slug", getSalonBySlug);
// Protected route for an owner to create their profile
router.route("/").post(protect, createSalon);

// Specific route for the logged-in owner to get their salon.
// This MUST come BEFORE the dynamic '/:id' route.
router.route("/mysalon").get(protect, getMySalon);
// Dynamic route to get a single salon's details by its ID.
router.route("/:id").get(getSalonById);

// Protected route for an owner to update their OWN profile by its ID.
router.route("/:id").put(protect, requireActiveSubscription, updateSalon);

// --- Service Routes ---
router.route("/:id/services").post(protect, requireActiveSubscription, addSalonService);
router
  .route("/:id/services/:service_id")
  .put(protect, requireActiveSubscription, updateSalonService)
  .delete(protect, requireActiveSubscription, deleteSalonService);

// --- Review Router ---
// Any request to /api/salons/:id/reviews will be handled by reviewRouter
router.use("/:id/reviews", reviewRouter);

module.exports = router;
