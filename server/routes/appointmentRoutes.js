// server/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getSalonAppointments,
  getMyApointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// Route for a customer to create a new appointment
router.route('/').post(protect, createAppointment);

// Route for a customer to view their own appointments
router.route('/myappointments').get(protect, getMyApointments);

// Route for a salon owner to get all appointments for their salon
router.route('/salon/:salonId').get(protect, getSalonAppointments);

// Route for a salon owner to update the status of an appointment
router.route('/:id/status').put(protect, updateAppointmentStatus);

module.exports = router;