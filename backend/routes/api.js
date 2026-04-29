const express = require('express');
const router = express.Router();
const axios = require('axios');
const Crop = require('../models/Crop');
const Price = require('../models/Price');
const Prediction = require('../models/Prediction');

// GET Crop Prices
router.get('/prices', async (req, res) => {
    try {
        const prices = await Price.find().populate('crop');
        
        if (prices.length === 0) {
            return res.json([
                { name: 'Paddy', type: 'grain', market_price: 25.0, date: new Date() },
                { name: 'Groundnut', type: 'oilseed', market_price: 60.0, date: new Date() },
                { name: 'Sunflower', type: 'oilseed', market_price: 55.0, date: new Date() }
            ]);
        }

        const formattedPrices = prices.map(p => ({
            id: p._id,
            name: p.crop ? p.crop.name : 'Unknown',
            type: p.crop ? p.crop.type : 'Unknown',
            market_price: p.market_price,
            date: p.date
        }));
        
        res.json(formattedPrices);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// POST Predict Yield via ML Service
router.post('/predict', async (req, res) => {
    try {
        const { crop, land_size, rainfall, soil_type, user_id } = req.body;
        
        const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
        let predictedYield = 0;
        let predictedYieldPerAcre = 0;
        
        try {
            const mlResponse = await axios.post(`${mlUrl}/predict`, {
                crop, soil_type, rainfall, land_size
            }, { timeout: 2000 });
            
            if (!mlResponse.data.success) {
                 return res.status(400).json({ error: mlResponse.data.error });
            }
            
            predictedYield = mlResponse.data.total_predicted_yield_kg;
            predictedYieldPerAcre = mlResponse.data.predicted_yield_per_acre;
        } catch (mlErr) {
            console.log("Using Mock Data since ML API is offline.");
            predictedYieldPerAcre = crop === 'Paddy' ? 2200 : (crop === 'Groundnut' ? 950 : 800);
            if (rainfall < 600) predictedYieldPerAcre *= 0.8;
            predictedYield = predictedYieldPerAcre * land_size;
        }
        
        let marketPrice = 50; 
        try {
            const cropDoc = await Crop.findOne({ name: crop });
            if (cropDoc) {
                const priceDoc = await Price.findOne({ crop: cropDoc._id }).sort({ date: -1 });
                if (priceDoc) marketPrice = priceDoc.market_price;
            }
        } catch (e) {}
        
        const estimCost = land_size * 10000;
        const profit = (predictedYield * marketPrice) - estimCost;

        if (user_id) {
            try {
                const newPrediction = new Prediction({
                    user: user_id, crop_name: crop, land_size, rainfall, soil_type, 
                    predicted_yield: predictedYield, calculated_profit: profit
                });
                await newPrediction.save();
            } catch (e) { console.error("DB Save Prediction Error:", e); }
        }

        res.json({
            success: true, yield_per_acre: predictedYieldPerAcre, total_yield: predictedYield,
            profit, market_price: marketPrice, estimated_cost: estimCost
        });
    } catch (err) {
        console.error(err.message);
        if (err.response) return res.status(err.response.status).json(err.response.data);
        res.status(500).send('Server Error calling ML service');
    }
});

// POST Compare Crops
router.post('/compare', async (req, res) => {
    try {
        const { crops, land_size, rainfall, soil_type } = req.body;
        const results = [];
        const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
        
        for (let crop of crops) {
            let predictedYield = 0;
            let yield_per_acre = 0;
            try {
                const mlResponse = await axios.post(`${mlUrl}/predict`, { crop, soil_type, rainfall, land_size }, { timeout: 2000 });
                if (mlResponse.data.success) {
                    predictedYield = mlResponse.data.total_predicted_yield_kg;
                    yield_per_acre = mlResponse.data.predicted_yield_per_acre;
                }
            } catch (mlErr) {
                yield_per_acre = crop === 'Paddy' ? 2200 : (crop === 'Groundnut' ? 950 : 800);
                if (rainfall < 600) yield_per_acre *= 0.8;
                predictedYield = yield_per_acre * land_size;
            }

            if (predictedYield > 0) {
                let marketPrice = 50;
                try {
                    const cropDoc = await Crop.findOne({ name: crop });
                    if (cropDoc) {
                        const priceDoc = await Price.findOne({ crop: cropDoc._id }).sort({ date: -1 });
                        if (priceDoc) marketPrice = priceDoc.market_price;
                    }
                } catch(e) {}
                
                const estimCost = land_size * 10000;
                const profit = (predictedYield * marketPrice) - estimCost;
                
                results.push({
                    crop, yield_per_acre: yield_per_acre,
                    total_yield: predictedYield, profit, market_price: marketPrice, estimated_cost: estimCost
                });
            }
        }
        
        let bestCrop = results.length > 0 ? results.reduce((prev, current) => (prev.profit > current.profit) ? prev : current) : null;
        res.json({ comparison: results, best_recommendation: bestCrop });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
