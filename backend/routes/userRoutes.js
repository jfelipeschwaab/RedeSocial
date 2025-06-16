const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', userController.getAllUsers);
router.get('/profile/:username', authMiddleware, userController.getUserProfile);

module.exports = router;