const Employee = require('../models/Employee');

// @desc    Get current logged in employee's profile
// @route   GET /api/employees/me
// @access  Private
const getMyProfile = async (req, res) => {
    try {
        // Find employee where the 'userId' matches the logged-in user
        const employee = await Employee.findOne({ userId: req.user._id }).populate('userId', 'name email role');

        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMyProfile };
// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Everyone can see the list, but maybe only basic info)
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate('userId', 'name email') // Get name/email from User model
            .select('-salary'); // HIDE SALARY (Privacy!)

        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Don't forget to export it!
module.exports = { getMyProfile, getAllEmployees };