const Holiday = require('../models/Holiday');

// @desc    Get all holidays (For Calendar)
const getHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.find().sort({ date: 1 });
        res.json(holidays);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a Holiday (Admin Only)
const addHoliday = async (req, res) => {
    try {
        const { date, name, type } = req.body;
        const holiday = await Holiday.create({ date, name, type });
        res.status(201).json(holiday);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Holiday
const deleteHoliday = async (req, res) => {
    try {
        await Holiday.findByIdAndDelete(req.params.id);
        res.json({ message: 'Holiday removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getHolidays, addHoliday, deleteHoliday };