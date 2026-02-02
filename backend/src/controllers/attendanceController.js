const Attendance = require('../models/Attendance');

// Helper to get today's date string "YYYY-MM-DD"
const getTodayDate = () => new Date().toISOString().split('T')[0];

// @desc    Clock In
// @route   POST /api/attendance/clock-in

const getAttendanceByUser = async (req, res) => {
    try {
        const history = await Attendance.find({ userId: req.params.id }).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllAttendance = async (req, res) => {
    try {
        const { date } = req.query;
        let query = {};
        
        // If a date is sent (e.g., ?date=2026-02-02), filter by it. 
        // Otherwise, return everything (or last 30 days to be safe).
        if (date) {
            query.date = date;
        }

        const history = await Attendance.find(query)
            .populate('userId', 'name email') // Get the Employee Name
            .sort({ date: -1 }); // Newest first
        
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clockIn = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = getTodayDate();

        // 1. Check if already clocked in
        const existingAttendance = await Attendance.findOne({ userId, date: today });
        
        if (existingAttendance) {
            return res.status(400).json({ message: 'You have already clocked in today' });
        }

        // 2. Create new entry
        const attendance = await Attendance.create({
            userId,
            date: today,
            clockIn: new Date(),
            status: 'Present'
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clock Out
// @route   PUT /api/attendance/clock-out
const clockOut = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = getTodayDate();

        const attendance = await Attendance.findOne({ userId, date: today });

        if (!attendance) {
            return res.status(400).json({ message: 'You have not clocked in yet' });
        }
        
        if (attendance.clockOut) {
            return res.status(400).json({ message: 'You have already clocked out' });
        }

        // 3. Update Clock Out time
        attendance.clockOut = new Date();
        
        // 4. Calculate Total Hours (Difference in milliseconds / 1000 / 3600)
        const diff = attendance.clockOut - attendance.clockIn;
        attendance.totalHours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));

        await attendance.save();

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Today's Status (For the UI button)
// @route   GET /api/attendance/status
const getTodayStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = getTodayDate();
        
        const attendance = await Attendance.findOne({ userId, date: today });
        res.json(attendance || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { clockIn, clockOut, getTodayStatus };

// @desc    Get my attendance history
// @route   GET /api/attendance/me
const getMyAttendance = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Find all records for this user, sorted by newest first
        const history = await Attendance.find({ userId }).sort({ date: -1 });
        
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update exports
module.exports = { clockIn, clockOut, getTodayStatus, getMyAttendance, getAllAttendance, getAttendanceByUser };