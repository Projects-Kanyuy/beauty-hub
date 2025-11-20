// controllers/paymentController.js
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const SubscriptionType = require('../models/subscriptionTypeModel.js');
const { v4: uuidv4 } = require('uuid');

/**
 * @swagger
 * /api/payments/initiate-swychr:
 *   post:
 *     summary: Initiate Swychr payment for salon subscription
 *     description: |
 *       This endpoint initializes a payment with Swychr.
 *       
 *       • User selects a plan → sends only the `subscriptionTypeId`
 *       • Backend fetches plan details (amount, name, specs)
 *       • Generates a unique reference and calls Swychr `/transactions/initialize`
 *       • Returns Swychr payment URL + reference for frontend redirect or modal
 *       
 *       After successful payment, user submits the `paymentReference` to `/api/salons` to create salon.
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
 *             properties:
 *               subscriptionTypeId:
 *                 type: string
 *                 description: ID of the selected subscription plan
 *                 example: 671f3a2b9e4d8c1f5a6b7c8d
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentReference:
 *                       type: string
 *                       description: Use this in /api/salons to create salon after payment
 *                       example: SWY-20251120123456789
 *                     paymentUrl:
 *                       type: string
 *                       description: Redirect user here or open in modal
 *                       example: https://checkout.swychr.com/pay/SWY-20251120123456789
 *                     amount:
 *                       type: number
 *                       example: 49900
 *                     planName:
 *                       type: string
 *                       example: Pro
 *       400:
 *         description: Invalid or missing subscription plan
 *       500:
 *         description: Failed to initialize payment with Swychr
 */

const initiateSwychrPayment = asyncHandler(async (req, res) => {
  const { subscriptionTypeId } = req.body;
  const customerEmail = req.user.email;
  const customerName = req.user.name || req.user.username || 'Customer';

  if (!subscriptionTypeId) {
    res.status(400);
    throw new Error('subscriptionTypeId is required');
  }

  const plan = await SubscriptionType.findById(subscriptionTypeId);
  if (!plan) {
    res.status(400);
    throw new Error('Invalid subscription plan selected');
  }

  const paymentReference = `SWY-${Date.now()}-${uuidv4().slice(0, 8)}`;

  const payload = {
    amount: plan.amount,
    email: customerEmail,
    reference: paymentReference,
    currency: 'NGN',
    callback_url: process.env.SWYCHR_CALLBACK_URL,
    metadata: {
      plan_id: plan._id.toString(),
      plan_name: plan.planName,
      user_id: req.user._id.toString(),
      type: 'salon_subscription',
    },
  };

  try {
    const auth = Buffer.from(
      `${process.env.SWYCHR_EMAIL}:${process.env.SWYCHR_PASSWORD}`
    ).toString('base64');

    const response = await axios.post(
      `${process.env.SWYCHR_BASE_URL}/transactions/initialize`,
      payload,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    const swychrData = response.data;

    if (!swychrData.status || !swychrData.data?.authorization_url) {
      throw new Error('Invalid response from Swychr');
    }

    res.json({
      success: true,
      data: {
        paymentReference: swychrData.data.reference || paymentReference,
        paymentUrl: swychrData.data.authorization_url,
        amount: plan.amount,
        planName: plan.planName,
        planSpecs: plan.planSpecs,
      },
    });
  } catch (error) {
    console.error('Swychr Init Error:', error.response?.data || error.message);
    res.status(500);
    throw new Error('Failed to initialize payment with Swychr');
  }
});

// This is the ONLY line that matters for CommonJS
module.exports = initiateSwychrPayment;
