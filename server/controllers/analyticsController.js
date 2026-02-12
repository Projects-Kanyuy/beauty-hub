const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");
const Salon = require("../models/salonModel");
const Review = require("../models/reviewModel");
const mongoose = require("mongoose");
/**
 * @swagger
 * /api/analytics/salon:
 *   get:
 *     summary: Get analytics dashboard data for the authenticated salon owner
 *     description: Returns key performance indicators (KPIs), monthly booking trends, and service popularity breakdown for the salon owner's dashboard. Accessible only by authenticated salon owners.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved salon analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kpis:
 *                   type: object
 *                   properties:
 *                     totalEarnings:
 *                       type: number
 *                       example: 350000
 *                       description: Total earnings in the selected period (in your currency's smallest unit, e.g., cents or your local equivalent)
 *                     newClients:
 *                       type: integer
 *                       example: 14
 *                       description: Number of first-time clients in the period
 *                     completedAppointments:
 *                       type: integer
 *                       example: 45
 *                       description: Total number of completed appointments
 *                     avgRating:
 *                       type: number
 *                       format: float
 *                       example: 4.8
 *                       description: Average customer rating out of 5
 *                 bookingsOverTime:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "Oct"
 *                       bookings:
 *                         type: integer
 *                         example: 45
 *                   description: Monthly booking count for the last 4–6 months (for line/bar chart)
 *                 servicePopularity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Box Braids"
 *                       value:
 *                         type: integer
 *                         example: 40
 *                   description: Percentage distribution of bookings by service type (for pie/donut chart)
 *             example:
 *               kpis:
 *                 totalEarnings: 350000
 *                 newClients: 14
 *                 completedAppointments: 45
 *                 avgRating: 4.8
 *               bookingsOverTime:
 *                 - month: "Jul"
 *                   bookings: 25
 *                 - month: "Aug"
 *                   bookings: 30
 *                 - month: "Sep"
 *                   bookings: 42
 *                 - month: "Oct"
 *                   bookings: 45
 *               servicePopularity:
 *                 - name: "Box Braids"
 *                   value: 40
 *                 - name: "Cornrows"
 *                   value: 25
 *                 - name: "Treatments"
 *                   value: 15
 *                 - name: "Other"
 *                   value: 20
 *       401:
 *         description: Not authorized - token missing or invalid
 *       403:
 *         description: Forbidden - user is not a salon owner
 */

const getSalonAnalytics = asyncHandler(async (req, res) => {
  const salonOwnerId = req.user.id;

  // ----------------------
  // Step 1: Get salon
  // ----------------------
  const salon = await Salon.findOne({ owner: salonOwnerId }).populate(
    "reviews"
  );
  if (!salon) return res.status(404).json({ message: "Salon not found" });

  const salonId = salon._id;

  // ----------------------
  // Step 2: Get all appointments for this salon
  // ----------------------
  const appointments = await Appointment.find({ salon: salonId });

  // ----------------------
  // Step 3: Calculate KPIs
  // ----------------------
  const totalEarnings = appointments.reduce(
    (acc, a) => acc + Number(a.amount),
    0
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "Completed"
  ).length;

  // Count new clients in the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const recentAppointments = appointments.filter(
    (a) => a.appointmentDateTime >= sixMonthsAgo
  );
  const newClients = new Set(recentAppointments.map((a) => a.clientName)).size;

  // Average rating from salon.reviews
  const reviews = await Review.find({ salon: salonId });
  const ratings = reviews.map((r) => r.rating);
  const avgRating = ratings.length
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  // ----------------------
  // Step 4: Bookings over time (last 6 months)
  // ----------------------
  const bookingsOverTimeMap = {};
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleString("default", { month: "short" });
    bookingsOverTimeMap[monthKey] = 0;
  }

  appointments.forEach((a) => {
    const monthKey = a.appointmentDateTime.toLocaleString("default", {
      month: "short",
    });
    if (monthKey in bookingsOverTimeMap) bookingsOverTimeMap[monthKey]++;
  });

  const bookingsOverTime = Object.keys(bookingsOverTimeMap).map((month) => ({
    month,
    bookings: bookingsOverTimeMap[month],
  }));

  // ----------------------
  // Step 5: Service popularity
  // ----------------------
  const serviceCountMap = {};
  appointments.forEach((a) => {
    const service = salon.services.find(
      (s) => s._id.toString() === a.serviceId.toString()
    );
    const name = service ? service.name : "Unknown Service";
    serviceCountMap[name] = (serviceCountMap[name] || 0) + 1;
  });

  const servicePopularity = Object.keys(serviceCountMap).map((name) => ({
    name,
    value: serviceCountMap[name],
  }));

  // ----------------------
  // Step 6: Respond
  // ----------------------
  res.json({
    kpis: { totalEarnings, newClients, completedAppointments, avgRating },
    bookingsOverTime,
    servicePopularity,
  });
});

module.exports = { getSalonAnalytics };
