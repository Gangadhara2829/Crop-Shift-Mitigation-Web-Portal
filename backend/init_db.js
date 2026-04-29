const mongoose = require('mongoose');
require('dotenv').config();

const Crop = require('./models/Crop');
const Price = require('./models/Price');

async function initDB() {
    try {
        console.log(`Connecting to MongoDB at ${process.env.MONGO_URI}...`);
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('Inserting seed data...');
        const cropsData = [
            { name: 'Paddy', type: 'grain', water_requirement: 'High', soil_preference: 'Clay' },
            { name: 'Groundnut', type: 'oilseed', water_requirement: 'Low', soil_preference: 'Sandy Loam' },
            { name: 'Sunflower', type: 'oilseed', water_requirement: 'Medium', soil_preference: 'Loam' }
        ];

        for (const c of cropsData) {
            await Crop.findOneAndUpdate({ name: c.name }, c, { upsert: true, new: true });
        }

        const paddy = await Crop.findOne({ name: 'Paddy' });
        const groundnut = await Crop.findOne({ name: 'Groundnut' });
        const sunflower = await Crop.findOne({ name: 'Sunflower' });

        await Price.findOneAndUpdate({ crop: paddy._id }, { crop: paddy._id, market_price: 25.0 }, { upsert: true });
        await Price.findOneAndUpdate({ crop: groundnut._id }, { crop: groundnut._id, market_price: 60.0 }, { upsert: true });
        await Price.findOneAndUpdate({ crop: sunflower._id }, { crop: sunflower._id, market_price: 55.0 }, { upsert: true });

        console.log('✅ MongoDB Database seeded successfully! You can press Ctrl+C to exit and then sign up on your site.');
    } catch (err) {
        console.error('❌ Error seeding MongoDB. Check your connection string!', err.message);
    } finally {
        mongoose.connection.close();
    }
}

initDB();
