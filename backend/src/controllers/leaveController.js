const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// @desc    Apply for a new leave
// @route   POST /api/leaves
const applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        const userId = req.user._id;

        // 1. Get Employee ID (e.g., GTS-001) for the record
        const employee = await Employee.findOne({ userId });
        
        // Fallback if employee profile doesn't exist yet
        const employeeId = employee ? employee.employeeId : 'UNKNOWN';

        // 2. Create the Leave Request
        const leave = await Leave.create({
            userId,
            employeeId,
            leaveType,
            startDate,
            endDate,
            reason
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my leave history
// @route   GET /api/leaves/me
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get ALL leaves (For Admin Dashboard)
// @route   GET /api/leaves
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('userId', 'name').sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Leave Status (Approve/Reject)
// @route   PUT /api/leaves/:id/status
const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const leave = await Leave.findById(req.params.id);

        if (leave) {
            leave.status = status;
            await leave.save();
            res.json(leave);
        } else {
            res.status(404).json({ message: 'Leave request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus };