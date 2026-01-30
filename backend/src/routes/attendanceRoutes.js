const express = require('express');
const router = express.Router();
const { clockIn, clockOut, getTodayStatus } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/clock-in', protect, clockIn);
router.put('/clock-out', protect, clockOut);
router.get('/status', protect, getTodayStatus);

module.exports = router;