// server/controllers/messageController.js
const asyncHandler = require('express-async-handler');
const Conversation = require('../models/messageModel');
const Salon = require('../models/salonModel');

// @desc    Get all conversations for the logged-in salon owner
// @route   GET /api/messages
// @access  Private (Salon Owner)
const getMyConversations = asyncHandler(async (req, res) => {
  // 1. Find the salon owned by the logged-in user
  const salon = await Salon.findOne({ owner: req.user._id });

  if (!salon) {
    // If the user doesn't own a salon, they have no conversations
    return res.json([]);
  }

  // 2. Find all conversations related to this salon
  // We populate participant details so we can show their names on the frontend
  const conversations = await Conversation.find({ salon: salon._id })
    .populate('participants', 'name')
    .sort({ updatedAt: -1 }); // Show most recent conversations first

  res.json(conversations);
});

// We can add a sendMessage controller here later

module.exports = { getMyConversations };