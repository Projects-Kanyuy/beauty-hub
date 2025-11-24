const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");
const SubscriptionType = require("../models/subscriptionTypeModel");
const Payment = require("../models/paymentModel");
const mongoose = require("mongoose");
const { createPaymentLink, login } = require("../services/swychrService");

const subscribe = asyncHandler(async (req, res) => {
  const { planId } = req.body;

  const user = req.user;

  if (!planId) {
    return res.status(400).json({ message: "Subscription plan id not found" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // creating a transaction, so that we can roll back if there is an error at any step

    // Step 1: Fetch the subscription plan from the plan id
    const plan = await SubscriptionType.findById(planId);

    if (!plan) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    console.log("fetched plan: ", { plan });

    // step 2: create the subscription
    const subscriptionPayload = {
      user: user?._id,
      plan: planId,
      durationMonths: plan.durationMonths,
    };
    const createdSubscription = await Subscription.create(subscriptionPayload);

    // Step 2: create the payment entity
    const paymentPayload = {
      entity: "Subscription",
      entityId: createdSubscription?._id,
      userId: user?._id,
      amount: plan?.amount,
      currency: plan?.currency,
    };
    const createdPayment = await Payment.create(paymentPayload);

    // Step 3: initiate the payment
    const token = await login();

    const payload = {
      country_code: "CM",
      name: user?.name || "Customer",
      email: user?.email,
      mobile: user?.phone,
      amount: plan?.amount,
      currency: plan?.currency,
      transaction_id: createdPayment._id,
      description: `BeautyHub - ${plan.planName} Plan`,
      pass_digital_charge: false,
    };

    const swychrResponse = await createPaymentLink(token, payload);

    console.log(swychrResponse, ":response");

    // Step 4: Update payment with payment url
    await Payment.findByIdAndUpdate(createdPayment?._id, {
      $set: {
        paymentUrl:
          swychrResponse.data?.payment_link ||
          `https://pay.accountpe.com/link/${createdPayment._id}`,
      },
    });
    // Step 4: update the created subscription with the payment id
    await Subscription.findByIdAndUpdate(createdSubscription._id, {
      $set: { paymentRef: createdPayment._id },
    });

    // finally: return
    return res.json({
      success: true,
      data: {
        paymentReference: createdPayment?._id,
        paymentUrl:
          swychrResponse.data?.payment_link ||
          `https://pay.accountpe.com/link/${createdSubscription?._id}`,
        amount: plan.amount,
        planName: plan.planName,
        planSpecs: plan.planSpecs,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res
      .status(500)
      .json({ message: "Transaction failed", error: error.message });
  }
});

const getMySubscriptionHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const total = await Subscription.countDocuments({ user: userId });

  const subscriptions = await Subscription.find({
    user: user?._id,
    status: { $ne: "Created" },
  })
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    total,
    data: subscriptions,
  });
});

const getActiveSubscription = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const activeSub = await Subscription.getActiveSubscription(userId);

  return res.status(200).json({
    data: activeSub,
  });
});

module.exports = {
  subscribe,
  getMySubscriptionHistory,
  getActiveSubscription,
};
