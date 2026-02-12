// server/controllers/subscriptionTypeController.js
const asyncHandler = require("express-async-handler");
const SubscriptionType = require("../models/subscriptionTypeModel");

/**
 * @swagger
 * /api/subscriptions/types:
 *   get:
 *     summary: Get all subscription plans (Public)
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of all available plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubscriptionType'
 */
const getSubscriptionTypes = asyncHandler(async (req, res) => {
  const plans = await SubscriptionType.find({});
  res.json(plans);
});

const getSubscriptionTypeById = asyncHandler(async (req, res) => {
  const plan = await SubscriptionType.findById(req.params.id);
  res.json({
    data: plan,
  });
});

/**
 * @swagger
 * /api/subscriptions/types:
 *   post:
 *     summary: Create new subscription plan (Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionType'
 *     responses:
 *       201:
 *         description: Plan created successfully
 */
const createSubscriptionType = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admins can create subscription plans");
  }

  const { planName, planSpecs, description, currency, amount, durationMonths } =
    req.body;

  const plan = await SubscriptionType.create({
    planName,
    planSpecs,
    description,
    amount,
    currency,
    durationMonths,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  res.status(201).json(plan);
});

/**
 * @swagger
 * /api/subscriptions/types/{id}:
 *   put:
 *     summary: Update subscription plan (Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionType'
 *     responses:
 *       200:
 *         description: Plan updated successfully
 */
const updateSubscriptionType = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admins can update plans");
  }

  const plan = await SubscriptionType.findById(req.params.id);
  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }

  const updatedPlan = await SubscriptionType.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true }
  );

  res.json(updatedPlan);
});

/**
 * @swagger
 * /api/subscriptions/types/{id}:
 *   delete:
 *     summary: Delete a subscription plan (Admin only)
 *     description: Permanently removes a subscription plan. Use with caution!
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscription plan ID
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription plan deleted successfully"
 *       404:
 *         description: Plan not found
 *       403:
 *         description: Not authorized as admin
 */
const deleteSubscriptionType = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admins can delete subscription plans");
  }

  const plan = await SubscriptionType.findById(req.params.id);

  if (!plan) {
    res.status(404);
    throw new Error("Subscription plan not found");
  }

  await SubscriptionType.deleteOne({ _id: req.params.id });
  // Or: await plan.remove(); (older Mongoose versions)

  res.json({ message: "Subscription plan deleted successfully" });
});

module.exports = {
  getSubscriptionTypes,
  createSubscriptionType,
  updateSubscriptionType,
  deleteSubscriptionType, // ← Added
  getSubscriptionTypeById,
};
