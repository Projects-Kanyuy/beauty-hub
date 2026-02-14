const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");

(async () => {
  try {
    console.log("Starting appointment customer migration...");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for migration");

    const Appointment = require("../models/appointmentModel");
    const User = require("../models/userModel");

    const appointments = await Appointment.find({
      $or: [{ customer: { $exists: false } }, { customer: null }],
    });

    if (!appointments.length) {
      console.log("No appointments missing customer field.");
      await mongoose.disconnect();
      process.exit(0);
    }

    const updates = [];
    const missing = [];

    for (const appointment of appointments) {
      let user = null;

      if (appointment.clientNumber) {
        user = await User.findOne({ phone: appointment.clientNumber });
      }

      if (!user && appointment.clientName) {
        user = await User.findOne({ name: appointment.clientName });
      }

      if (!user) {
        missing.push({
          appointmentId: appointment._id,
          clientName: appointment.clientName,
          clientNumber: appointment.clientNumber,
        });
        continue;
      }

      updates.push({
        updateOne: {
          filter: { _id: appointment._id },
          update: { $set: { customer: user._id } },
        },
      });
    }

    if (updates.length) {
      const result = await Appointment.bulkWrite(updates);
      console.log("Updated appointments:", result.modifiedCount);
    }

    if (missing.length) {
      console.log("Appointments without matching user:");
      for (const item of missing) {
        console.log(item);
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
})();
