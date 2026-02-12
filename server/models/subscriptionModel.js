const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionType",
      required: true,
    },
    durationMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Created", "Active", "Expired", "Cancelled"],
      default: "Created",
    },
    paymentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  { timestamps: true }
);

/* -------------------------------------------------------
   POST-FIND: After reading documents
   - Check if endDate < now
   - If yes and status not already Expired → update
------------------------------------------------------- */
subscriptionSchema.post("find", async function (docs) {
  const now = new Date();

  const updates = docs
    .filter(
      (doc) => doc.endDate && doc.endDate < now && doc.status !== "Expired"
    )
    .map((doc) => doc.updateOne({ status: "Expired" }));

  if (updates.length > 0) {
    await Promise.all(updates);
  }
});

subscriptionSchema.post("findOne", async function (doc) {
  if (!doc) return;

  const now = new Date();

  if (doc.endDate && doc.endDate < now && doc.status !== "Expired") {
    await doc.updateOne({ status: "Expired" });
  }
});

// static method: get active subscription
subscriptionSchema.statics.getActiveSubscription = async function (userId) {
  const active = await this.findOne({
    user: userId,
    status: "Active",
  }).populate("plan");

  return active;
};

/* -------------------------------------------------------
   STATIC: activate a subscription
   - Sets status = "Active"
   - Sets startDate = now
   - Sets endDate = startDate + durationMonths
------------------------------------------------------- */
subscriptionSchema.statics.activate = async function (subscriptionId) {
  const subscription = await this.findById(subscriptionId);
  if (!subscription) throw new Error("Subscription not found");

  if (subscription.status === "Active") {
    return subscription; // Already active
  }

  const now = new Date();
  subscription.status = "Active";
  subscription.startDate = now;

  const end = new Date(now);
  end.setMonth(end.getMonth() + subscription.durationMonths);
  subscription.endDate = end;

  await subscription.save();
  return subscription;
};

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
