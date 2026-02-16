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
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["XAF", "XOF", "NGN", "GHS", "USD", "KES", "TZS", "UGX", "ZMW", "INR"],
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
