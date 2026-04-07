const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");
const SubscriptionType = require("../models/subscriptionTypeModel");
const Payment = require("../models/paymentModel");
const mongoose = require("mongoose");
const { createPaymentLink, login, getFiatRate } = require("../services/swychrService");
const Coupon = require("../models/couponModel");
const convertCurrency = require("../utils/currencyConverter");
const axios = require("axios");
/**
 * @desc    Initiate Subscription with Dynamic Currency Conversion
 * @route   POST /api/subscriptions/subscribe
 * @access  Private
 */
const subscribe = asyncHandler(async (req, res) => {
  const { planId, countryCode, currency } = req.body;
  const user = req.user;

  console.log("--- INITIATING DYNAMIC SUBSCRIBE ---");
  console.log("Input:", { planId, countryCode, currency });

  if (!planId || !countryCode || !currency) {
    return res.status(400).json({ message: "Missing required fields: planId, countryCode, or currency" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch Plan
   const plan = await SubscriptionType.findOne({ slug: planId }).session(session);
    if (!plan) throw new Error("Subscription plan not found");

    // 2. Login to Swychr
    const token = await login();

    // 3. Get the exact Rate again to ensure precision
    const rateValue = await getFiatRate(token, countryCode, 1);
    const finalAmount = Math.ceil(plan.amount * rateValue);

    console.log(`Final Calculation: $${plan.amount} * ${rateValue} = ${finalAmount} ${currency}`);

    // 4. Create Subscription
    const [createdSubscription] = await Subscription.create(
      [{
        user: user._id,
        plan: plan._id,
        durationMonths: plan.durationMonths,
      }],
      { session }
    );

    // 5. Create Payment record
    const [createdPayment] = await Payment.create(
      [{
        entity: "Subscription",
        entityId: createdSubscription._id,
        userId: user._id,
        amount: finalAmount,
        currency: currency,
      }],
      { session }
    );

    // 6. Prepare Swychr Payload
    const payload = {
      country_code: countryCode,
      name: user?.name || "Customer",
      email: user?.email,
      mobile: user?.phone || "0000000000",
      amount: finalAmount,
      currency: currency,
      transaction_id: createdPayment._id.toString(),
      description: `BeautyHub - ${plan.planName} Plan`,
      pass_digital_charge: false,
    };

    // 7. Call Swychr
    const swychrResponse = await createPaymentLink(token, payload);
    console.log("Swychr Response:", swychrResponse);

    // Check success (Swychr uses status: 200 or status: "success")
    const isSuccess = swychrResponse.status === 200 || swychrResponse.status === "success" || swychrResponse.success;

    if (!isSuccess) {
      throw new Error(swychrResponse.message || "Failed to create Swychr link");
    }

    const paymentUrl = swychrResponse.data?.payment_link || swychrResponse.payment_link;

    // 8. Update records with URL
    await Payment.findByIdAndUpdate(createdPayment._id, { $set: { paymentUrl } }).session(session);
    await Subscription.findByIdAndUpdate(createdSubscription._id, { $set: { paymentRef: createdPayment._id } }).session(session);

    // 9. COMMIT
    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      data: {
        paymentUrl,
        paymentReference: createdPayment._id,
        subscriptionId: createdSubscription._id
      }
    });

  } catch (error) {
    console.error("CRITICAL SUBSCRIBE ERROR:", error.message);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: error.message });
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
/**
 * @desc    Get converted price for a plan based on country
 * @route   GET /api/subscriptions/price/:planId/:countryCode
 */
const getConvertedPrice = asyncHandler(async (req, res) => {
  const { planId, countryCode } = req.params;

   const plan = await SubscriptionType.findOne({ slug: planId });
  if (!plan) return res.status(404).json({ message: "Plan not found" });

  const token = await login();
  const rate = await getFiatRate(token, countryCode, 1); // Get rate for $1
  
  const finalAmount = Math.ceil(plan.amount * rate);

  res.json({
    success: true,
    data: {
      usdAmount: plan.amount,
      localAmount: finalAmount,
      rate: rate
    }
  });
});

module.exports = {
  subscribe,
  getMySubscriptionHistory,
  getActiveSubscription,
  createCouponCode,
  redeemCouponCode,
  getConvertedPrice
};
