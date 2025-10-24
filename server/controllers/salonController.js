// server/controllers/salonController.js
const asyncHandler = require('express-async-handler');
const Salon = require('../models/salonModel');

// @desc    Fetch all salons
// @route   GET /api/salons
// @access  Public
const getSalons = asyncHandler(async (req, res) => {
  const salons = await Salon.find({}); // Find all salons
  res.json(salons);
});

// @desc    Fetch a single salon by ID
// @route   GET /api/salons/:id
// @access  Public
const getSalonById = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (salon) {
    res.json(salon);
  } else {
    res.status(404);
    throw new Error('Salon not found');
  }
});

// @desc    Create a new salon profile
// @route   POST /api/salons
// @access  Private (Salon Owner only)
const createSalon = asyncHandler(async (req, res) => {
  // We assume the user is a salon owner because of our middleware
  // req.user is available because of our 'protect' middleware
  const ownerId = req.user._id;

  // Check if this owner already has a salon
  const salonExists = await Salon.findOne({ owner: ownerId });
  if (salonExists) {
    res.status(400);
    throw new Error('Salon profile already exists for this user');
  }

  // Get data from the request body
  const { name, description, address, city, phone, openingHours } = req.body;

  const salon = new Salon({
    owner: ownerId,
    name,
    description,
    address,
    city,
    phone,
    openingHours,
    // Add other fields as needed
  });

  const createdSalon = await salon.save();
  res.status(201).json(createdSalon);
});

// @desc    Update a salon profile
// @route   PUT /api/salons/:id
// @access  Private (Salon Owner only)
const updateSalon = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (salon) {
    // Authorization check: Make sure the logged-in user is the owner of this salon
    if (salon.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this salon');
    }

    // Update the fields
    salon.name = req.body.name || salon.name;
    salon.description = req.body.description || salon.description;
    salon.address = req.body.address || salon.address;
    salon.city = req.body.city || salon.city;
    salon.phone = req.body.phone || salon.phone;
    salon.openingHours = req.body.openingHours || salon.openingHours;
    salon.photos = req.body.photos || salon.photos;

    const updatedSalon = await salon.save();
    res.json(updatedSalon);
  } else {
    res.status(404);
    throw new Error('Salon not found');
  }
});

// @desc    Add a new service to a salon
// @route   POST /api/salons/:id/services
// @access  Private (Salon Owner only)
const addSalonService = asyncHandler(async (req, res) => {
  const { name, description, price, duration } = req.body;
  const salon = await Salon.findById(req.params.id);

  if (salon) {
    // Authorization check
    if (salon.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to add services to this salon');
    }

    const service = {
      name,
      description,
      price,
      duration,
    };

    salon.services.push(service);
    await salon.save();
    res.status(201).json({ message: 'Service added' });
  } else {
    res.status(404);
    throw new Error('Salon not found');
  }
});

// @desc    Update a service in a salon
// @route   PUT /api/salons/:id/services/:service_id
// @access  Private (Salon Owner only)
const updateSalonService = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (salon) {
    // Authorization check
    if (salon.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const service = salon.services.id(req.params.service_id); // Mongoose helper to find sub-document
    if (service) {
      service.name = req.body.name || service.name;
      service.description = req.body.description || service.description;
      service.price = req.body.price || service.price;
      service.duration = req.body.duration || service.duration;

      await salon.save();
      res.json({ message: 'Service updated' });
    } else {
      res.status(404);
      throw new Error('Service not found');
    }
  } else {
    res.status(404);
    throw new Error('Salon not found');
  }
});

// @desc    Delete a service from a salon
// @route   DELETE /api/salons/:id/services/:service_id
// @access  Private (Salon Owner only)
const deleteSalonService = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (salon) {
    // Authorization check
    if (salon.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const service = salon.services.id(req.params.service_id);
    if (service) {
      await service.deleteOne(); // Mongoose 6+ method for removing sub-documents
      await salon.save();
      res.json({ message: 'Service removed' });
    } else {
      res.status(404);
      throw new Error('Service not found');
    }
  } else {
    res.status(404);
    throw new Error('Salon not found');
  }
});
// @desc    Get the salon profile of the logged-in owner
// @route   GET /api/salons/mysalon
// @access  Private (Salon Owner only)
const getMySalon = asyncHandler(async (req, res) => {
  // req.user is available from the 'protect' middleware
  const salon = await Salon.findOne({ owner: req.user._id });

  if (salon) {
    res.json(salon);
  } else {
    res.status(404);
    throw new Error('Salon profile not found for this user. Please create one.');
  }
});

// --- UPDATE THE MODULE EXPORTS ---
module.exports = {
  getSalons,
  getSalonById,
  createSalon,
  updateSalon,
  addSalonService,    // <-- Add new function
  updateSalonService, // <-- Add new function
  deleteSalonService, // <-- Add new function
  getMySalon
};