// server/models/messageModel.js
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique conversation ID
 *         salon:
 *           type: string
 *           description: Reference to the salon this conversation belongs to
 *         participants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *           description: List of users in the conversation (customer + salon owner)
 *         lastMessage:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *             sender:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "66789abc123def456789abcd"
 *         salon: "66789abc123def456789abce"
 *         participants:
 *           - _id: "66789abc123def456789abcf"
 *             name: "Sarah K."
 *           - _id: "66789abc123def456789abcd0"
 *             name: "Glam Studio"
 *         lastMessage:
 *           text: "See you tomorrow at 3pm! 💇‍♀️"
 *           sender: "66789abc123def456789abcf"
 *           createdAt: "2025-11-18T14:22:10.000Z"
 */
// Schema for a single message within a conversation
const singleMessageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Schema for a full conversation thread
const conversationSchema = mongoose.Schema(
  {
    // Array of participants (e.g., customer and salon owner)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // The salon this conversation is about
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
    },
    // The array of all messages in this thread
    messages: [singleMessageSchema],
  },
  {
    timestamps: true, // Will track when the conversation was created and last updated
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;