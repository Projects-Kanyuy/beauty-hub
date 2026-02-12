const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Created", "Completed", "Canceled", "Failed"],
      default: "Created",
      required: true,
    },

    // The type of item this payment is for
    entity: {
      type: String,
      enum: ["Subscription"], // extend this later (e.g., "Order", "Invoice", etc.)
      required: true,
    },

    // The specific entity record ID
    entityId: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["USD", "XAF"],
      default: "XAF",
      required: true,
    },
    paymentUrl: String,
    gateway: { type: String, default: "swychr" },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
