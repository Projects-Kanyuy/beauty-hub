const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: false, // auto-generated
      unique: true,
      uppercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["FREE_PLAN_MONTH", "ADD_MONTH"],
      required: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionType",
      required: function () {
        return this.type === "FREE_PLAN_MONTH";
      },
    },

    maxRedemptions: {
      type: Number,
      default: 1,
    },

    timesRedeemed: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

/* ---------------------------------------------------
   Generate Coupon Code (Option C)
--------------------------------------------------- */

function generateSegment(length = 4) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

function generateCouponCode(prefix) {
  return `${prefix}-${generateSegment()}-${generateSegment()}`;
}

/* ---------------------------------------------------
   Pre-Save Hook
   Auto-generate code only if not manually set
--------------------------------------------------- */
couponSchema.pre("save", async function (next) {
  if (this.code) return next(); // allow manual override

  let prefix = "";
  if (this.type === "FREE_PLAN_MONTH") prefix = "FREE";
  if (this.type === "ADD_MONTH") prefix = "ADD";

  let generatedCode;

  // ensure uniqueness
  while (true) {
    generatedCode = generateCouponCode(prefix);
    const exists = await mongoose.models.Coupon.findOne({
      code: generatedCode,
    });
    if (!exists) break;
  }

  this.code = generatedCode;
  next();
});

couponSchema.statics.incrementRedemption = async function (couponId, session) {
  return this.findByIdAndUpdate(
    couponId,
    { $inc: { timesRedeemed: 1 } },
    { new: true, session }
  );
};

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
