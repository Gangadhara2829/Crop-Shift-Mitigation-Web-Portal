from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
from model import train_and_save_model
import numpy as np

app = Flask(__name__)
CORS(app)

# Ensure model exists
if not os.path.exists('model_artifacts/rf_model.pkl'):
    train_and_save_model()

# Load model and encoders
with open('model_artifacts/rf_model.pkl', 'rb') as f:
    model = pickle.load(f)
with open('model_artifacts/crop_encoder.pkl', 'rb') as f:
    crop_encoder = pickle.load(f)
with open('model_artifacts/soil_encoder.pkl', 'rb') as f:
    soil_encoder = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        crop = data.get('crop')
        soil = data.get('soil_type')
        rainfall = float(data.get('rainfall'))
        land_size = float(data.get('land_size', 1)) # Default 1 acre
        
        # Transform inputs
        try:
            crop_encoded = crop_encoder.transform([crop])[0]
        except ValueError:
            return jsonify({'error': f'Unknown crop: {crop}. Supported crops: {list(crop_encoder.classes_)}'}), 400
            
        try:
            soil_encoded = soil_encoder.transform([soil])[0]
        except ValueError:
            return jsonify({'error': f'Unknown soil: {soil}. Supported soils: {list(soil_encoder.classes_)}'}), 400
            
        # Predict yield per acre
        features = np.array([[crop_encoded, soil_encoded, rainfall]])
        yield_per_acre = model.predict(features)[0]
        
        total_yield = yield_per_acre * land_size
        
        return jsonify({
            'success': True,
            'predicted_yield_per_acre': round(yield_per_acre, 2),
            'total_predicted_yield_kg': round(total_yield, 2),
            'crop': crop,
            'land_size': land_size
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
