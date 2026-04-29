const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
    crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
    market_price: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Price', PriceSchema);
