// server/controllers/appointmentController.js
const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");
const Salon = require("../models/salonModel");

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create a new appointment (Customer only)
 *     description: Allows an authenticated customer to book a new appointment at a salon.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salonId
 *               - serviceName
 *               - servicePrice
 *               - startTime
 *               - endTime
 *             properties:
 *               salonId:
 *                 type: string
 *                 description: ID of the salon
 *               serviceName:
 *                 type: string
 *                 example: "Box Braids + Install"
 *               servicePrice:
 *                 type: number
 *                 example: 25000
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-01T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-01T13:00:00Z"
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Not authenticated
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

  if (
    !salonId ||
    !serviceId ||
    !appointmentDateTime ||
    !clientName ||
    !clientNumber
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required appointment details" });
  }

  const salon = await Salon.findById(salonId);

  if (!salon) {
    return res
      .status(404)
      .json({ message: `Salon with id ${salonId} not found` });
  }

  const service = salon.services.id(serviceId);

  if (!service) {
    return res.status(404).json({
      message: `Service with id ${serviceId} not found for given salon with id ${salonId}`,
    });
  }

  if (homeService && !service.homeService) {
    return res
      .status(400)
      .json({ message: `This service was not specified as a home service` });
  }

  const appointment = await Appointment.create({
    clientName,
    clientNumber,
    customer: req.user._id,
    salon: salonId,
    serviceId: serviceId,
    appointmentDateTime,
    amount: homeService
      ? service.price + service.homeServiceFee
      : service.price,
    currency: service.currency,
    homeService,
    status: "Pending",
  });

  res.status(201).json({
    data: appointment,
  });
});

/**
 * @swagger
 * /api/appointments/salon/{salonId}:
 *   get:
 *     summary: Get all appointments for a specific salon (Salon Owner only)
 *     description: Returns all appointments belonging to the salon. Only the salon owner can access this.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: List of appointments with customer details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Not authorized (not the salon owner)
 *       404:
 *         description: Salon not found
 */
const getSalonAppointments = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.salonId);

  if (!salon || salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to view these appointments");
  }

  const appointments = await Appointment.find({
    salon: req.params.salonId,
  });

  res.json(appointments);
});

/**
 * @swagger
 * /api/appointments/myappointments:
 *   get:
 *     summary: Get current customer's appointments
 *     description: Returns all appointments made by the authenticated customer.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customer's appointments with salon details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Not authenticated
 */
const getMyApointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    customer: req.user._id,
  }).populate("salon", "name address");
  res.json(appointments);
});

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   put:
 *     summary: Update appointment status (Salon Owner only)
 *     description: Allows salon owner to confirm, cancel, or mark an appointment as completed.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Confirmed, Cancelled, Completed]
 *                 example: Confirmed
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Not authorized (not the salon owner)
 *       404:
 *         description: Appointment not found
 */
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id).populate(
    "salon"
  );

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (appointment.salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this appointment");
  }

  if (!["Confirmed", "Cancelled", "Completed"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
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
