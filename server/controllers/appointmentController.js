// server/controllers/appointmentController.js
const asyncHandler = require('express-async-handler');
const Appointment = require('../models/appointmentModel');
const Salon = require('../models/salonModel');

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private (Customer)
const createAppointment = asyncHandler(async (req, res) => {
  const { salonId, serviceName, servicePrice, startTime, endTime } = req.body;

  if (!salonId || !serviceName || !servicePrice || !startTime || !endTime) {
    res.status(400);
    throw new Error('Please provide all required appointment details');
  }

  // req.user is the logged-in customer from the 'protect' middleware
  const appointment = await Appointment.create({
    customer: req.user._id,
    salon: salonId,
    serviceName,
    servicePrice,
    startTime,
    endTime,
    status: 'Pending', // Appointments always start as pending
  });

  res.status(201).json(appointment);
});

// @desc    Get appointments for a specific salon
// @route   GET /api/appointments/salon/:salonId
// @access  Private (Salon Owner)
const getSalonAppointments = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.salonId);

  // Authorization Check: Ensure the logged-in user owns this salon
  if (!salon || salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to view these appointments');
  }

  // Find all appointments for this salon and populate the customer's name and email
  const appointments = await Appointment.find({ salon: req.params.salonId }).populate('customer', 'name email');

  res.json(appointments);
});

// @desc    Get appointments for the logged-in customer
// @route   GET /api/appointments/myappointments
// @access  Private (Customer)
const getMyApointments = asyncHandler(async (req, res) => {
  // Find all appointments where the customer ID matches the logged-in user's ID
  const appointments = await Appointment.find({ customer: req.user._id }).populate('salon', 'name address');
  res.json(appointments);
});

// @route   PUT /api/appointments/:id/status
// @access  Private (Salon Owner)
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id).populate('salon');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Authorization Check: Ensure the logged-in user owns the salon
  if (appointment.salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this appointment');
  }

  // Add validation for status if you want
  if (!['Confirmed', 'Cancelled', 'Completed'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  appointment.status = status;
  const updatedAppointment = await appointment.save();

  res.json(updatedAppointment);
});

module.exports = {
  createAppointment,
  getSalonAppointments,
  getMyApointments,
  updateAppointmentStatus,
};