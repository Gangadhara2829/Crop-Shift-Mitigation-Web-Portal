CREATE DATABASE oilseed_platform;
-- Connect to oilseed_platform before running the following

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    location VARCHAR(100),
    land_size NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50), -- e.g., 'oilseed', 'grain'
    water_requirement VARCHAR(50),
    soil_preference VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS prices (
    id SERIAL PRIMARY KEY,
    crop_id INTEGER REFERENCES crops(id),
    market_price NUMERIC, -- per kg
    date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    crop_name VARCHAR(50),
    land_size NUMERIC,
    rainfall NUMERIC,
    soil_type VARCHAR(50),
    predicted_yield NUMERIC,
    calculated_profit NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some dummy crops
INSERT INTO crops (name, type, water_requirement, soil_preference) VALUES
('Paddy', 'grain', 'High', 'Clay'),
('Groundnut', 'oilseed', 'Low', 'Sandy Loam'),
('Sunflower', 'oilseed', 'Medium', 'Loam')
ON CONFLICT (name) DO NOTHING;

-- Insert some dummy prices
INSERT INTO prices (crop_id, market_price) VALUES
((SELECT id FROM crops WHERE name='Paddy'), 25.0),
((SELECT id FROM crops WHERE name='Groundnut'), 60.0),
((SELECT id FROM crops WHERE name='Sunflower'), 55.0);
