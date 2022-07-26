const express = require('express');
const { postUser, loginUser, getMe } = require('../controllers/userController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')

router.post('/', postUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router;