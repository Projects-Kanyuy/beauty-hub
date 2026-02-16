const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");
const Salon = require("../models/salonModel");
const User = require("../models/userModel");

/**
 * @desc    Create a new appointment (Guest or Registered)
 * @route   POST /api/appointments
 * @access  Public (Optional Auth)
 */
const createAppointment = asyncHandler(async (req, res) => {
  const {
    salonId,
    serviceId,
    appointmentDateTime,
    clientName,
    clientNumber,
    homeService,
  } = req.body;

  // Basic Validation
  if (!salonId || !serviceId || !appointmentDateTime || !clientName || !clientNumber) {
    res.status(400);
    throw new Error("Please provide all required appointment details");
  }

  // Verify Salon and Service
  const salon = await Salon.findById(salonId);
  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  const service = salon.services.id(serviceId);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  // --- GHOST ACCOUNT LOGIC ---
  let customerId;

  if (req.user) {
    // Case A: User is logged in
    customerId = req.user._id;
  } else {
    // Case B: Guest User
    // 1. Check if a user with this phone number already exists
    let user = await User.findOne({ phone: clientNumber });

    if (!user) {
      // 2. Create a "Ghost" user if they don't exist
      // We generate a placeholder email since it's usually required/unique in schemas
      const tempEmail = `${clientNumber}@guest.beautyheaven.site`;
      const tempPassword = Math.random().toString(36).slice(-10);

      user = await User.create({
        name: clientName,
        phone: clientNumber,
        email: tempEmail,
        password: tempPassword,
        role: "customer",
        isVerified: true, // We trust them because they provided a phone for the salon
      });
    }
    customerId = user._id;
  }

  // Calculate Amount
  const amount = homeService 
    ? service.price + (service.homeServiceFee || 0) 
    : service.price;

  // Create Appointment
  const appointment = await Appointment.create({
    clientName,
    clientNumber,
    customer: customerId,
    salon: salonId,
    serviceId: serviceId,
    serviceName: service.name,
    appointmentDateTime,
    amount,
    currency: service.currency || salon.currency || "XAF",
    homeService: homeService || false,
    status: "Pending",
  });

  res.status(201).json({
    success: true,
    message: "Booking requested successfully",
    data: appointment,
  });
});

/**
 * @desc    Get all appointments for a specific salon (Owner only)
 */
const getSalonAppointments = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.salonId);

  if (!salon || salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to view these appointments");
  }

  const appointments = await Appointment.find({ salon: req.params.salonId })
    .populate("customer", "name phone email")
    .sort("-appointmentDateTime");

  res.json(appointments);
});

/**
 * @desc    Get current customer's appointments
 */
const getMyApointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ customer: req.user._id })
    .populate("salon", "name address phone")
    .sort("-appointmentDateTime");
  res.json(appointments);
});

/**
 * @desc    Update status (Owner only)
 */
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id).populate("salon");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (appointment.salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
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