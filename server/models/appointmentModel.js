// server/models/appointmentModel.js
const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Salon',
    },
    serviceName: { type: String, required: true },
    servicePrice: { type: Number, required: true },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;