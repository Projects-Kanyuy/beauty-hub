// server/index.js
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const subscriptionTypeRoutes = require("./routes/subscriptionTypeRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes.js");
const userRoutes = require("./routes/userRoutes");
const salonRoutes = require("./routes/salonRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const paymentRoutes = require("./routes/paymentRoutes.js");
const adminRoutes = require("./routes/adminRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Swagger dependencies
const swaggerSpec = require("./config/swagger"); // ← our spec
const swaggerUi = require("swagger-ui-express");

dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });
dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// === Swagger Documentation Routes ===
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Optional: GET raw OpenAPI JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Root route
app.get("/", (req, res) => {
  res.send(`
    <h1>BeautyHeaven API is running!</h1>
    <p><a href="/api-docs" target="_blank">📚 Open API Documentation (Swagger UI)</a></p>
  `);
});

// === Your API routes ===
app.use("/api/subscription-types", subscriptionTypeRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI → http://localhost:${PORT}/api-docs`);
});
