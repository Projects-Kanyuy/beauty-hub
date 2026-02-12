const express = require('express');
const router = express.Router();
const { getMyMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { getMyConversations } = require('../controllers/messageController');
router.route('/').get(protect, getMyConversations);
module.exports = router;