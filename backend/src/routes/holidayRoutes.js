const express = require('express');
const router = express.Router();
const { getHolidays, addHoliday, deleteHoliday } = require('../controllers/holidayController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getHolidays); // Everyone can see holidays
router.post('/', protect, admin, addHoliday); // Only Admin adds
router.delete('/:id', protect, admin, deleteHoliday);

module.exports = router;