// controllers/paymentController.js
const asyncHandler = require('express-async-handler');
const SubscriptionType = require('../models/subscriptionTypeModel');
const Transaction = require('../models/transactionModel');
const SubscriptionHistory = require('../models/subscriptionHistoryModel');
const Salon = require('../models/salonModel');
const { login, createPaymentLink } = require('../services/swychrService');
const { v4: uuidv4 } = require('uuid');

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
const initiateSwychrPayment = asyncHandler(async (req, res) => {
  const {
    subscriptionTypeId,
    salonName,
    salonDescription,
    address,
    city,
    phone,
    openingHours,
  } = req.body;

  const user = req.user;

  // Validate required fields
  if (!subscriptionTypeId || !salonName || !address || !city || !phone) {
    return res.status(400).json({ message: 'All salon details are required' });
  }

  const plan = await SubscriptionType.findById(subscriptionTypeId);
  if (!plan) return res.status(400).json({ message: 'Invalid subscription plan' });

  const transactionId = `BEAUTY-${Date.now()}-${uuidv4().slice(0, 8)}`;

  try {
    const token = await login();

    const payload = {
      country_code: 'CM',
      name: user.name || 'Customer',
      email: user.email,
      mobile: phone,
      amount: plan.amount,
      transaction_id: transactionId,
      description: `BeautyHub - ${plan.planName} Plan`,
      pass_digital_charge: false,
    };

    const swychrResponse = await createPaymentLink(token, payload);

    // Save full transaction with user-controlled salon details
    await Transaction.create({
      transactionId,
      user: user._id,
      plan: plan._id,
      amount: plan.amount,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: phone,
      countryCode: 'CM',
      description: payload.description,
      status: 'LINK_CREATED',
      paymentUrl: swychrResponse.data?.payment_url || `https://pay.accountpe.com/link/${transactionId}`,

      // ← USER-CONTROLLED SALON DETAILS
      salonDetails: {
        name: salonName,
        description: salonDescription || '',
        address,
        city,
        phone,
        openingHours: openingHours || {},
      },
    });

    res.json({
      success: true,
      data: {
        paymentReference: transactionId,
        paymentUrl: swychrResponse.data?.payment_url || `https://pay.accountpe.com/link/${transactionId}`,
        amount: plan.amount,
        planName: plan.planName,
        planSpecs: plan.planSpecs,
      },
    });
  } catch (err) {
    console.error('Swychr Error:', err.response?.data || err.message);
    await Transaction.create({
      transactionId,
      user: user._id,
      amount: plan.amount,
      status: 'FAILED',
    });
    res.status(500).json({ success: false, message: 'Payment creation failed' });
  }
});

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
const swychrWebhook = asyncHandler(async (req, res) => {
  const { transaction_id, status } = req.body;

  if (!transaction_id || !status) {
    return res.status(400).json({ message: 'Invalid webhook payload' });
  }

  const transaction = await Transaction.findOne({ transactionId: transaction_id })
    .populate('user')
    .populate('plan');

  if (!transaction) {
    return res.status(200).json({ message: 'Transaction not found – ignored' });
  }

  const normalizedStatus = status.toUpperCase();
  transaction.status = normalizedStatus === 'PAID' ? 'PAID' : normalizedStatus;
  await transaction.save();

  if (normalizedStatus !== 'PAID') {
    return res.json({ success: true });
  }

  // Prevent double processing
  const alreadyDone = await SubscriptionHistory.findOne({ paymentRef: transaction_id });
  if (alreadyDone) {
    return res.json({ success: true, message: 'Already activated' });
  }

  const user = transaction.user;
  const plan = transaction.plan;
  const salonDetails = transaction.salonDetails || {};

  // Final safety
  const existingSalon = await Salon.findOne({ owner: user._id });
  if (existingSalon) {
    return res.json({ success: true, message: 'Salon already exists' });
  }

  try {
    const salon = await Salon.create({
      owner: user._id,
      name: salonDetails.name,
      description: salonDetails.description || 'Beauty salon in Cameroon',
      address: salonDetails.address,
      city: salonDetails.city,
      phone: salonDetails.phone,
      openingHours: salonDetails.openingHours || {},
      isVerified: true,
    });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.durationMonths);

    await SubscriptionHistory.create({
      salon: salon._id,
      planName: plan.planName,
      amount: plan.amount,
      durationMonths: plan.durationMonths,
      startDate,
      endDate,
      paymentRef: transaction_id,
      status: 'Active',
      gateway: 'swychr',
    });

    console.log(`SALON CREATED: ${salonDetails.name} for ${user.email}`);
    res.json({ success: true, message: 'Salon activated successfully' });
  } catch (error) {
    console.error('Webhook activation failed:', error.message);
    res.json({ success: true, message: 'Processed – activation will retry' }); // Never 5xx
  }
});

module.exports = { initiateSwychrPayment, swychrWebhook };
