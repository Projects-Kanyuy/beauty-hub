const asyncHandler = require('express-async-handler');
const getSalonAnalytics = asyncHandler(async (req, res) => {
  // In a real app, you would query your database here.
  // For now, we send back data that matches the frontend's needs.
  const analyticsData = {
    kpis: { totalEarnings: 350000, newClients: 14, completedAppointments: 45, avgRating: 4.8 },
    bookingsOverTime: [
      { month: 'Jul', bookings: 25 }, { month: 'Aug', bookings: 30 }, { month: 'Sep', bookings: 42 }, { month: 'Oct', bookings: 45 },
    ],
    servicePopularity: [
      { name: 'Box Braids', value: 40 }, { name: 'Cornrows', value: 25 }, { name: 'Treatments', value: 15 }, { name: 'Other', value: 20 },
    ],
  };
  res.json(analyticsData);
});
module.exports = { getSalonAnalytics };