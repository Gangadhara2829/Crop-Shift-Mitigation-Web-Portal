import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import pickle
import os

def generate_mock_data():
    np.random.seed(42)
    n_samples = 1000
    
    crops = ['Paddy', 'Groundnut', 'Sunflower']
    soils = ['Clay', 'Sandy Loam', 'Loam', 'Sandy']
    
    data = {
        'crop': np.random.choice(crops, n_samples),
        'soil_type': np.random.choice(soils, n_samples),
        'rainfall': np.random.uniform(500, 1500, n_samples), # mm
        'land_size': np.random.uniform(1, 10, n_samples), # acres
    }
    
    df = pd.DataFrame(data)
    
    # Calculate mock yield based on some logical rules
    # Yield in kg per acre
    def calc_yield(row):
        base_yield = 0
        if row['crop'] == 'Paddy':
            base_yield = 2000
            if row['rainfall'] > 1000 and row['soil_type'] == 'Clay':
                base_yield += 500
        elif row['crop'] == 'Groundnut':
            base_yield = 800
            if row['rainfall'] < 800 and row['soil_type'] == 'Sandy Loam':
                base_yield += 200
        elif row['crop'] == 'Sunflower':
            base_yield = 700
            if 600 < row['rainfall'] < 1000 and row['soil_type'] == 'Loam':
                base_yield += 150
                
        # Add random noise
        return base_yield + np.random.normal(0, 50)
        
    df['yield'] = df.apply(calc_yield, axis=1)
    return df

def train_and_save_model():
    print("Generating mock data and training model...")
    df = generate_mock_data()
    
    crop_encoder = LabelEncoder()
    df['crop_encoded'] = crop_encoder.fit_transform(df['crop'])
    
    soil_encoder = LabelEncoder()
    df['soil_encoded'] = soil_encoder.fit_transform(df['soil_type'])
    
    X = df[['crop_encoded', 'soil_encoded', 'rainfall']] # predicting yield per acre, so independent of land_size
    y = df['yield']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save model and encoders
    os.makedirs('model_artifacts', exist_ok=True)
    with open('model_artifacts/rf_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('model_artifacts/crop_encoder.pkl', 'wb') as f:
        pickle.dump(crop_encoder, f)
    with open('model_artifacts/soil_encoder.pkl', 'wb') as f:
        pickle.dump(soil_encoder, f)
    
    print("Model trained and saved successfully.")

if __name__ == '__main__':
    train_and_save_model()
