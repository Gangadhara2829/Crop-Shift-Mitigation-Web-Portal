const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String },
    water_requirement: { type: String },
    soil_preference: { type: String }
});

module.exports = mongoose.model('Crop', CropSchema);
