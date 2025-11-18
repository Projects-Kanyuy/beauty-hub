const asyncHandler = require('express-async-handler');

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
  // In a real app, you would query your database here using req.user.id (salon owner)
  // For now, we send back mock data that matches the frontend's expectations.
  const analyticsData = {
    kpis: { totalEarnings: 350000, newClients: 14, completedAppointments: 45, avgRating: 4.8 },
    bookingsOverTime: [
      { month: 'Jul', bookings: 25 },
      { month: 'Aug', bookings: 30 },
      { month: 'Sep', bookings: 42 },
      { month: 'Oct', bookings: 45 },
    ],
    servicePopularity: [
      { name: 'Box Braids', value: 40 },
      { name: 'Cornrows', value: 25 },
      { name: 'Treatments', value: 15 },
      { name: 'Other', value: 20 },
    ],
  };

  res.json(analyticsData);
});

module.exports = { getSalonAnalytics };
