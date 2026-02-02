const express = require('express');
const router = express.Router();
const { clockIn, clockOut, getTodayStatus, getMyAttendance, getAllAttendance, getAttendanceByUser } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/clock-in', protect, clockIn);
router.put('/clock-out', protect, clockOut);
router.get('/status', protect, getTodayStatus);
router.get('/me', protect, getMyAttendance);
router.get('/', protect, admin, getAllAttendance);
router.get('/user/:id', protect, admin, getAttendanceByUser);

module.exports = router;