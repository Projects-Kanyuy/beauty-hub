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

    // get the rates from pressmark, since it is already implemented there
    const { data: rates } = await axios.get(
      "https://api.pressmark.site/api/currency/rates"
    );

    console.log({ rates });

    const amountInXAF = convertCurrency(
      plan?.amount,
      plan?.currency,
      "XAF",
      rates
    );

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
      amount: amountInXAF,
      currency: "XAF",
    };
    const createdPayment = await Payment.create(paymentPayload);

    // Step 3: initiate the payment
    const token = await login();

    const payload = {
      country_code: "CM",
      name: user?.name || "Customer",
      email: user?.email,
      mobile: user?.phone,
      amount: amountInXAF,
      currency: "XAF",
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
        amount: amountInXAF,
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
