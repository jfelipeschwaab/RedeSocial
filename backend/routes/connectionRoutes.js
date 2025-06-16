const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request/:userId', authMiddleware, connectionController.sendRequest);
router.post('/accept/:userId', authMiddleware, connectionController.acceptRequest);
router.get('/notifications', authMiddleware, connectionController.getNotifications);

module.exports = router;