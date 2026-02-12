// controllers/paymentController.js
const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel");
const { login, getPaymentStatus } = require("../services/swychrService");
const Subscription = require("../models/subscriptionModel");
const crypto = require("crypto");

const STATUS_PENDING = 0;
const STATUS_SUCCESS = 1;
const STATUS_FAILED = 2;
/**
 * @swagger
 * /api/payments/initiate-swychr:
 *   post:
 *     summary: Initiate Swychr payment with full salon customization
 *     description: |
 *       Creates a Swychr payment link and saves user's salon details for auto-creation on success.
 *       Users provide their salon name, address, etc. before paying.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionTypeId
 *               - salonName
 *               - address
 *               - city
 *               - phone
 *             properties:
 *               subscriptionTypeId:
 *                 type: string
 *                 example: 671f3a2b9e4d8c1f5a6b7c8d
 *               salonName:
 *                 type: string
 *                 example: "Luxe Beauty Palace"
 *               salonDescription:
 *                 type: string
 *                 example: "Premium hair & nail services in Yaoundé"
 *               address:
 *                 type: string
 *                 example: "Rue des Pavillons, Bastos"
 *               city:
 *                 type: string
 *                 example: "Yaoundé"
 *               phone:
 *                 type: string
 *                 example: "+237699999999"
 *               openingHours:
 *                 type: object
 *                 example: { "monday": "09:00 - 19:00", "sunday": "Closed" }
 *     responses:
 *       200:
 *         description: Payment link generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentReference: { type: string }
 *                     paymentUrl: { type: string }
 *                     amount: { type: number }
 *                     planName: { type: string }
 */
// const initiateSwychrPayment = asyncHandler(async (req, res) => {
//   const {
//   entity,
//   entityId,
//   amount,
//   currency,
//   } = req.body;

//   const user = req.user;

//   // Validate required fields
//   if (!entity || !entityId || !amount || !currency) {
//     return res.status(400).json({ message: "All salon details are required" });
//   }

//   const plan = await SubscriptionType.findById(subscriptionTypeId);
//   if (!plan)
//     return res.status(400).json({ message: "Invalid subscription plan" });

//   const transactionId = `BEAUTY-${Date.now()}-${uuidv4().slice(0, 8)}`;

//   try {
//     const token = await login();

//     const payload = {
//       country_code: "CM",
//       name: user.name || "Customer",
//       email: user.email,
//       mobile: phone,
//       amount: plan.amount,
//       transaction_id: transactionId,
//       description: `BeautyHub - ${plan.planName} Plan`,
//       pass_digital_charge: false,
//     };

//     const swychrResponse = await createPaymentLink(token, payload);

//     // Save full transaction with user-controlled salon details
//     await Transaction.create({
//       transactionId,
//       user: user._id,
//       plan: plan._id,
//       amount: plan.amount,
//       customerName: user.name,
//       customerEmail: user.email,
//       customerPhone: phone,
//       countryCode: "CM",
//       description: payload.description,
//       status: "LINK_CREATED",
//       paymentUrl:
//         swychrResponse.data?.payment_url ||
//         `https://pay.accountpe.com/link/${transactionId}`,

//       // ← USER-CONTROLLED SALON DETAILS
//       salonDetails: {
//         name: salonName,
//         description: salonDescription || "",
//         address,
//         city,
//         phone,
//         openingHours: openingHours || {},
//       },
//     });

//     res.json({
//       success: true,
//       data: {
//         paymentReference: transactionId,
//         paymentUrl:
//           swychrResponse.data?.payment_url ||
//           `https://pay.accountpe.com/link/${transactionId}`,
//         amount: plan.amount,
//         planName: plan.planName,
//         planSpecs: plan.planSpecs,
//       },
//     });
//   } catch (err) {
//     console.error("Swychr Error:", err.response?.data || err.message);
//     await Transaction.create({
//       transactionId,
//       user: user._id,
//       amount: plan.amount,
//       status: "FAILED",
//     });
//     res
//       .status(500)
//       .json({ success: false, message: "Payment creation failed" });
//   }
// });

/**
 * @swagger
 * /api/payments/swychr/webhook:
 *   post:
 *     summary: Swychr Webhook – Auto-create user-defined salon on payment success
 *     description: |
 *       Called by Swychr on payment status change.
 *       When status = "paid" → creates salon using user's pre-filled details.
 *       Fully idempotent and resilient.
 *     tags: [Payments]
 */
const checkPaymentStatus = asyncHandler(async (req, res) => {
  const { id: transactionId } = req.params;

  const payment = await Payment.findById(transactionId);

  if (!payment) {
    return res.status(200).json({ message: "Transaction not found - ignored" });
  }

  try {
    // creating a transaction, so that we can roll back if there is an error at any step

    const token = await login();
    const paymentData = await getPaymentStatus(token, transactionId);

    const paymentStatus = paymentData.data.data.attributes.status;

    let statusResponse = "Created";

    switch (paymentStatus) {
      case STATUS_PENDING:
        break;
      case STATUS_SUCCESS:
        // 1. fetch the entity
        switch (payment.entity) {
          case "Subscription":
            const subscription = await Subscription.findById(payment.entityId);

            if (!subscription) {
              return res.status(404).json({
                message: `Subscription with id ${payment.entityId} not found`,
              });
            }

            if (subscription.status === "Active") {
              if (payment.status !== "Completed") {
                await Payment.findByIdAndUpdate(payment.id, {
                  $set: { status: "Completed" },
                });
              }
              return res.status(200).json({
                data: { status: "Completed" },
              });
            }

            await Payment.findByIdAndUpdate(payment.id, {
              $set: {
                status: "Completed",
              },
            });

            await Subscription.activate(subscription.id);
            statusResponse = "Completed";
            break;
          default:
            return res.status(400).json({
              message: `Unsupported payment entity ${payment.entity}`,
            });
        }
        break;
      default:
        await Payment.findByIdAndUpdate(payment.id, {
          $set: {
            status: "Failed",
          },
        });
        statusResponse = "Failed";
    }

    return res.status(200).json({
      data: {
        status: statusResponse,
      },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Error validating webhook: ${error}` });
  }
});

const verifyWebhookSignature = (rawBody, signature, secret) => {
  if (!secret) return true;
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
};

const handleSwychrWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-swychr-signature"];
  const secret = process.env.SWYCHR_WEBHOOK_SECRET;
  const rawBody = req.rawBody || "";

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return res.status(401).json({ message: "Invalid webhook signature" });
  }

  const transactionId =
    req.body?.data?.data?.attributes?.transaction_id ||
    req.body?.transaction_id;

  if (!transactionId) {
    return res.status(400).json({ message: "Missing transaction_id" });
  }

  const payment = await Payment.findById(transactionId);
  if (!payment) {
    return res.status(200).json({ message: "Transaction not found - ignored" });
  }

  const status = req.body?.data?.data?.attributes?.status;
  if (typeof status !== "number") {
    return res.status(400).json({ message: "Invalid status payload" });
  }

  if (status === STATUS_SUCCESS) {
    if (payment.status !== "Completed") {
      await Payment.findByIdAndUpdate(payment.id, { $set: { status: "Completed" } });
    }

    if (payment.entity === "Subscription") {
      const subscription = await Subscription.findById(payment.entityId);
      if (subscription && subscription.status !== "Active") {
        await Subscription.activate(subscription.id);
      }
    }
  } else if (status === STATUS_FAILED) {
    if (payment.status !== "Failed") {
      await Payment.findByIdAndUpdate(payment.id, { $set: { status: "Failed" } });
    }
  }

  return res.status(200).json({ received: true });
});

const handleSwychrRedirect = asyncHandler(async (req, res) => {
  const frontendBase =
    process.env.FRONTEND_URL || req.headers.origin || req.headers.referer;
  const transactionId =
    req.query?.transaction_id || req.query?.payment_id || "";
  const subscriptionId = req.query?.subscription_id || "";
  const planId = req.query?.plan_id || req.query?.plan || "";

  if (!frontendBase) {
    return res
      .status(200)
      .send("Payment completed. Please return to the app.");
  }

  const redirectUrl = new URL(frontendBase);
  redirectUrl.pathname = "/payment";
  if (transactionId) {
    redirectUrl.searchParams.set("transaction_id", transactionId);
  }
  if (subscriptionId) {
    redirectUrl.searchParams.set("subscription_id", subscriptionId);
  }
  if (planId) {
    redirectUrl.searchParams.set("plan", planId);
  }

  return res.redirect(302, redirectUrl.toString());
});

module.exports = {
  checkPaymentStatus,
  handleSwychrWebhook,
  handleSwychrRedirect,
};
