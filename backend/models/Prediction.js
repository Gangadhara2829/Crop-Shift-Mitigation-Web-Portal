const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    crop_name: { type: String },
    land_size: { type: Number },
    rainfall: { type: Number },
    soil_type: { type: String },
    predicted_yield: { type: Number },
    calculated_profit: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
