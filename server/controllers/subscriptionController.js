const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");
const SubscriptionType = require("../models/subscriptionTypeModel");
const Payment = require("../models/paymentModel");
const mongoose = require("mongoose");
const { createPaymentLink, login } = require("../services/swychrService");
const Coupon = require("../models/couponModel");
const convertCurrency = require("../utils/currencyConverter");
const axios = require("axios");
const subscribe = asyncHandler(async (req, res) => {
  const { planId } = req.body;
  const user = req.user;

  console.log("--- STARTING USD SUBSCRIBE ---");
  console.log("Plan ID:", planId);
  console.log("User Email:", user?.email);

  if (!planId) {
    return res.status(400).json({ message: "Subscription plan id not found" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const plan = await SubscriptionType.findById(planId).session(session);
    if (!plan) throw new Error("Plan not found in database");

    // Force USD logic
    const finalAmount = plan.amount;
    const finalCurrency = "USD";

    console.log(`Processing ${finalAmount} ${finalCurrency}`);

    // 1. Create Subscription
    const [createdSubscription] = await Subscription.create(
      [{
        user: user?._id,
        plan: planId,
        durationMonths: plan.durationMonths,
      }],
      { session }
    );

    // 2. Create Payment
    const [createdPayment] = await Payment.create(
      [{
        entity: "Subscription",
        entityId: createdSubscription?._id,
        userId: user?._id,
        amount: finalAmount,
        currency: finalCurrency,
      }],
      { session }
    );

    // 3. Swychr Login
    console.log("Logging into Swychr...");
    const token = await login();

    // 4. Swychr Payload
    const payload = {
      country_code: "CM", // Some gateways prefer CM even for USD, try "US" first
      name: user?.name || "Customer",
      email: user?.email,
      mobile: user?.phone || "0000000000", // Ensure this isn't empty
      amount: finalAmount,
      currency: finalCurrency,
      transaction_id: createdPayment._id.toString(),
      description: `BeautyHub - ${plan.planName} Plan`,
      pass_digital_charge: false,
    };

    console.log("Sending Payload to Swychr:", payload);

    const swychrResponse = await createPaymentLink(token, payload);
    
    console.log("Swychr API Response:", swychrResponse);

    if (swychrResponse.status !== "success" && !swychrResponse.success && swychrResponse.message !== "Payment link created successfully") {
       throw new Error(`Swychr Error: ${swychrResponse.message || "Unknown Provider Error"}`);
    }

    const paymentUrl = swychrResponse.data?.payment_link || swychrResponse.payment_link;

    if (!paymentUrl) throw new Error("Payment link was not returned by provider");

    await Payment.findByIdAndUpdate(createdPayment._id, { $set: { paymentUrl } }).session(session);
    await Subscription.findByIdAndUpdate(createdSubscription._id, { $set: { paymentRef: createdPayment._id } }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      data: { paymentUrl, amount: finalAmount, currency: finalCurrency },
    });

  } catch (error) {
    // THIS IS THE MOST IMPORTANT PART:
    console.error("!!! CRITICAL SUBSCRIBE ERROR !!!");
    console.error(error); // This will now show the full stack trace in your terminal
    
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null 
    });
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
  console.log({ userId });

  const activeSub = await Subscription.getActiveSubscription(userId);
  console.log({ activeSub });

  return res.status(200).json({
    data: activeSub,
  });
});

const createCouponCode = asyncHandler(async (req, res) => {
  const { type, planId, maxRedemptions, expiresAt } = req.body;

  if (type === "FREE_PLAN_MONTH" && !planId) {
    return res.status(400).json({
      message: "planId is required",
    });
  }
  const user = req.user;

  try {
    const coupon = await Coupon.create({
      type,
      plan: planId,
      maxRedemptions,
      createdBy: user?._id,
      expiresAt: new Date(expiresAt),
    });

    return res.status(201).json({
      data: {
        code: coupon.code,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating coupon", error: error.message });
  }
});

const redeemCouponCode = asyncHandler(async (req, res) => {
  const { code, subscriptionId } = req.body;
  const user = req.user;

  if (!code) {
    return res.status(400).json({ message: "Please enter a coupon code" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Fetch coupon (ignore case)
    const coupon = await Coupon.findOne({ code: code.toUpperCase() }).session(
      session
    );

    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    // Step 2: Validate coupon
    if (!coupon.isActive) throw new Error("Coupon is inactive");

    if (coupon.expiresAt < new Date()) throw new Error("Coupon has expired");

    if (coupon.timesRedeemed >= coupon.maxRedemptions) {
      throw new Error("Coupon redemption limit reached");
    }

    // Step 3: Coupon logic depending on type
    let subscription;

    // FREE_PLAN_MONTH → new-user only
    if (coupon.type === "FREE_PLAN_MONTH") {
      const previousSub = await Subscription.findOne({ user: user._id });

      if (previousSub) {
        throw new Error("This coupon is only valid for new users");
      }

      console.log({ coupon });

      // Create a new subscription for 1 month
      const plan = await SubscriptionType.findById(coupon.plan);
      if (!plan) throw new Error("Plan not found for this coupon");

      const payload = {
        user: user._id,
        plan: plan._id,
        durationMonths: 1,
        paymentRef: null, // Free → no payment
      };

      console.log({ payload });
      subscription = await Subscription.create(payload);

      if (!subscription) throw new Error("error creating subscription");

      console.log({ subscription });

      await Subscription.activate(subscription._id);
    }

    // ADD_MONTH → extend existing subscription or create minimal 1-month fallback
    if (coupon.type === "ADD_MONTH") {
      let existing = await Subscription.findOne({
        user: user._id,
        _id: subscriptionId, // use the specific subscription
      }).session(session);

      const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

      if (!existing) {
        throw new Error(
          "this coupon code is only for an existing subscription"
        );
      } else {
        // Extend existing subscription
        const newExpiry = existing.endDate
          ? new Date(existing.endDate.getTime() + ONE_MONTH)
          : new Date(Date.now() + ONE_MONTH);

        existing.endDate = newExpiry;
        subscription = await existing.save({ session });
      }
    }

    // Step 4: Increment redemption counter
    await Coupon.incrementRedemption(coupon._id, session);

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: "Coupon redeemed successfully",
      data: subscription,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  subscribe,
  getMySubscriptionHistory,
  getActiveSubscription,
  createCouponCode,
  redeemCouponCode,
};
