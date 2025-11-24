// server/models/appointmentModel.js
const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         customer:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         salon:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: string
 *         serviceName:
 *           type: string
 *         servicePrice:
 *           type: number
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [Pending, Confirmed, Cancelled, Completed]
 *         createdAt:
 *           type: string
 *           format: date-time
 */
const appointmentSchema = new mongoose.Schema(
  {
    clientName: String,
    clientNumber: String,
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Salon",
    },
    serviceId: { type: String, required: true },
    appointmentDateTime: {
      type: Date,
      required: true,
    },
    homeService: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: String,
      require: true,
    },
    currency: {
      type: String,
      enum: ["USD", "XAF"],
      default: "XAF",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
