const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // Format "YYYY-MM-DD"
    name: { type: String, required: true },
    type: { type: String, enum: ['National', 'Optional'], default: 'National' }
}, { timestamps: true });

module.exports = mongoose.model('Holiday', holidaySchema);