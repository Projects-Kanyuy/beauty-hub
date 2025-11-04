const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // Path module is kept for potential future use, but not for serving the build folder.
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Import all route files
const userRoutes = require("./routes/userRoutes");
const salonRoutes = require("./routes/salonRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const messageRoutes = require("./routes/messageRoutes");

// --- 2. INITIALIZATION & CONFIG ---
dotenv.config();
connectDB(); // Establish database connection
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Essential: Set this in your .env file!
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("BeautyHub API is running successfully...");
});

app.use("/api/users", userRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound); // Catches requests to non-existent routes.
app.use(errorHandler); // Catches and formats errors thrown in your routes.

// --- 7. SERVER STARTUP ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
