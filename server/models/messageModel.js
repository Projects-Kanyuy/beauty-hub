// server/models/messageModel.js
const mongoose = require('mongoose');

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