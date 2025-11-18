// server/controllers/salonController.js
const asyncHandler = require('express-async-handler');
const Salon = require('../models/salonModel');
const SubscriptionType = require('../models/subscriptionTypeModel');
const SubscriptionHistory = require('../models/subscriptionHistoryModel');

/**
 * @swagger
 * /api/salons:
 *   get:
 *     summary: Get all salons (Public)
 *     description: Returns a list of all registered salons with their basic info and services.
 *     tags: [Salons]
 *     responses:
 *       200:
 *         description: List of salons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salon'
 */
const getSalons = asyncHandler(async (req, res) => {
  const salons = await Salon.find({});
  res.json(salons);
});

/**
 * @swagger
 * /api/salons/{id}:
 *   get:
 *     summary: Get a single salon by ID (Public)
 *     tags: [Salons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: Salon details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salon'
 *       404:
 *         description: Salon not found
 */
const getSalonById = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);
  if (salon) res.json192(res.json(salon));
  else {
    res.status(404);
    throw new Error('Salon not found');
  }
});

/**
 * @swagger
 * /api/salons:
 *   post:
 *     summary: Create salon profile after successful payment
 *     description: |
 *       Salon creation is now paywalled. User must select a subscription plan.
 *       This endpoint expects a successful payment reference from your gateway (e.g. Paystack, Flutterwave).
 *       On success → creates salon + records subscription history.
 *     tags: [Salons]
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
 *               - paymentReference
 *               - name
 *               - description
 *               - address
 *               - city
 *               - phone
 *             properties:
 *               subscriptionTypeId:
 *                 type: string
 *                 description: ID of the chosen subscription plan
 *               paymentReference:
 *                 type: string
 *                 description: Payment gateway reference (verified on backend)
 *               name: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               phone: { type: string }
 *               openingHours: { type: object }
 *     responses:
 *       201:
 *         description: Salon created + subscription activated
 */
const createSalon = asyncHandler(async (req, res) => {
  const {
    subscriptionTypeId,
    paymentReference,
    name,
    description,
    address,
    city,
    phone,
    openingHours,
  } = req.body;

  const ownerId = req.user._id;

  // 1. Prevent duplicate salon
  const existingSalon = await Salon.findOne({ owner: ownerId });
  if (existingSalon) {
    res.status(400);
    throw new Error('You already have a salon profile');
  }

  // 2. Validate subscription plan exists
  const plan = await SubscriptionType.findById(subscriptionTypeId);
  if (!plan) {
    res.status(400);
    throw new Error('Invalid subscription plan selected');
  }

  // 3. TODO: Verify payment with your gateway (Paystack/Flutterwave)
  // Example for Paystack:
  // const paymentVerified = await verifyPaystackPayment(paymentReference, plan.amount);
  // if (!paymentVerified) throw new Error('Payment not verified');

  // For now, we'll skip actual verification (remove this in production!)
  // Remove this line when you add real payment verification:
  console.log('Payment verification skipped in dev mode');

  // 4. Create the salon
  const salon = await Salon.create({
    owner: ownerId,
    name,
    description,
    address,
    city,
    phone,
    openingHours,
    isVerified: true, // Paid users get instant verification
  });

  // 5. Calculate subscription end date
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + plan.durationMonths);

  // 6. Record subscription history
  await SubscriptionHistory.create({
    salon: salon._id,
    planName: plan.planName,
    amount: plan.amount,
    durationMonths: plan.durationMonths,
    startDate,
    endDate,
    paymentRef: paymentReference,
    status: 'Active',
  });

  res.status(201).json({
    message: 'Salon created successfully! Your subscription is active.',
    salon,
  });
});

/**
 * @swagger
 * /api/salons/{id}:
 *   put:
 *     summary: Update salon profile (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               phone: { type: string }
 *               openingHours: { type: object }
 *               photos: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Updated salon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salon'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Salon not found
 */
const updateSalon = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }

  if (salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this salon');
  }

  salon.name = req.body.name || salon.name;
  salon.description = req.body.description || salon.description;
  salon.address = req.body.address || salon.address;
  salon.city = req.body.city || salon.city;
  salon.phone = req.body.phone || salon.phone;
  salon.openingHours = req.body.openingHours || salon.openingHours;
  salon.photos = req.body.photos || salon.photos;

  const updatedSalon = await salon.save();
  res.json(updatedSalon);
});

/**
 * @swagger
 * /api/salons/{id}/services:
 *   post:
 *     summary: Add a new service to salon (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Box Braids"
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 35000
 *               duration:
 *                 type: string
 *                 example: "3-4 hours"
 *     responses:
 *       201:
 *         description: Service added successfully
 */
const addSalonService = asyncHandler(async (req, res) => {
  const { name, description, price, duration } = req.body;
  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }

  if (salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add services to this salon');
  }

  salon.services.push({ name, description, price, duration });
  await salon.save();
  res.status(201).json({ message: 'Service added' });
});

/**
 * @swagger
 * /api/salons/{id}/services/{service_id}:
 *   put:
 *     summary: Update a service (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: service_id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               duration: { type: string }
 *     responses:
 *       200:
 *         description: Service updated
 *       404:
 *         description: Salon or service not found
 */
const updateSalonService = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }

  if (salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const service = salon.services.id(req.params.service_id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  service.name = req.body.name || service.name;
  service.description = req.body.description || service.description;
  service.price = req.body.price || service.price;
  service.duration = req.body.duration || service.duration;

  await salon.save();
  res.json({ message: 'Service updated' });
});

/**
 * @swagger
 * /api/salons/{id}/services/{service_id}:
 *   delete:
 *     summary: Delete a service (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: service_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service removed successfully
 *       404:
 *         description: Salon or service not found
 */
const deleteSalonService = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }

  if (salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const service = salon.services.id(req.params.service_id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await service.deleteOne();
  await salon.save();
  res.json({ message: 'Service removed' });
});

/**
 * @swagger
 * /api/salons/mysalon:
 *   get:
 *     summary: Get logged-in owner's salon profile
 *     description: Returns the full salon profile belonging to the authenticated salon owner.
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner's salon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salon'
 *       404:
 *         description: No salon profile found — owner needs to create one
 */
const getMySalon = asyncHandler(async (req, res) => {
  const salon = await Salon.findOne({ owner: req.user._id });

  if (salon) {
    res.json(salon);
  } else {
    res.status(404);
    throw new Error('Salon profile not found for this user. Please create one.');
  }
});

module.exports = {
  getSalons,
  getSalonById,
  createSalon,
  updateSalon,
  addSalonService,
  updateSalonService,
  deleteSalonService,
  getMySalon,
};
