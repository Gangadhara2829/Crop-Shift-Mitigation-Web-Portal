# Crop Shift Mitigation Web Portal 

**Problem Statement ID:** 25273  
**Organization:** Ministry of Agriculture & Farmers Welfare (MoA&FW)  
**Domain:** Agriculture, FoodTech & Rural Development

## Project Overview
This project is a **Web-based Digital Platform** designed to encourage farmers to shift from traditional crops to oilseeds. It utilizes **predictive analytics** and **market intelligence** to provide:
- **Comparative Crop Economics:** "What-if" analysis for shifting to oilseeds.
- **Profitability Simulations:** Long-term profit forecasting.
- **Risk Mitigation:** Integration with government schemes like NMEO-OS and crop insurance.
- **Market Linkages:** Direct connection to Farmer Producer Organizations (FPOs).

A full-stack agricultural platform to help farmers transition to oilseed farming based on localized data, complete with mock Machine Learning predictions, financial comparisons, and market data tracking.

## Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Recharts
- **Backend**: Node.js, Express, PostgreSQL
- **ML Service**: Python, Flask, Scikit-Learn

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (Local server)

## 1. Database Setup
1. Ensure your PostgreSQL server is running.
2. In pgAdmin or your terminal, create a database named `oilseed_platform`.
3. Locate `backend/db/schema.sql`.
4. Run the queries inside `schema.sql` against the `oilseed_platform` database to create the required tables and seed the initial crops/prices data.

## 2. ML Service Setup
1. Open a new terminal and navigate to `ml-service`.
2. (Optional) Create a virtual environment: `python -m venv venv` and activate it.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask predicting service:
   ```bash
   python app.py
   ```
   > The service will automatically generate mock data, train the Random Forest model, save it, and start listening on port `5000`.

## 3. Node Backend Setup
1. Open a new terminal and navigate to `backend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `backend/.env` with your active PostgreSQL credentials.
4. Start the Express backend:
   ```bash
   npm run dev
   ```
   > This server starts on port `3000` and will proxy requests to the ML service.

## 4. Web Frontend Setup
1. Open a new terminal and navigate to `frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Browse to the URL provided by Vite (usually `http://localhost:5173`).

## Key Objectives
1. Increase domestic oilseed production to reduce import dependency.
2. Provide farmers with data-driven assurance for crop shifting.
3. Bridge the gap between farmers and government support systems.
