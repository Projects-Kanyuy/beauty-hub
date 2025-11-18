// server/controllers/messageController.js
const asyncHandler = require('express-async-handler');
const Conversation = require('../models/messageModel');
const Salon = require('../models/salonModel');

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all conversations for the authenticated salon owner
 *     description: Returns a list of all active conversations (chat threads) belonging to the salon owned by the logged-in user. Each conversation includes participant details (customer names) and is sorted by most recently updated.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Conversation'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 salon: "507f1f77bcf86cd799439012"
 *                 participants:
 *                   - _id: "507f1f77bcf86cd799439013"
 *                     name: "Alice Johnson"
 *                   - _id: "507f1f77bcf86cd799439014"
 *                     name: "BeautyHub Salon"
 *                 lastMessage:
 *                   text: "Yes, 2pm works perfectly!"
 *                   sender: "507f1f77bcf86cd799439013"
 *                   createdAt: "2025-11-18T10:30:00.000Z"
 *                 updatedAt: "2025-11-18T10:30:00.000Z"
 *                 createdAt: "2025-11-15T14:20:00.000Z"
 *       401:
 *         description: Not authenticated or token invalid
 *       403:
 *         description: Forbidden - User is not a salon owner or doesn't own a salon
 */
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

// Future endpoints you might add:
// - POST /api/messages/:conversationId → sendMessage
// - GET /api/messages/:conversationId → getMessagesInConversation

module.exports = { getMyConversations };
