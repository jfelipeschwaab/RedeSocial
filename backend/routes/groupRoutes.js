const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, groupController.createGroup);
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupDetails);
router.post('/:id/join', authMiddleware, groupController.joinGroup);
router.delete('/messages/:messageId', authMiddleware, groupController.deleteMessage);

// A rota POST para '/:id/messages' foi removida, pois agora é gerenciada pelo WebSocket.

module.exports = router;