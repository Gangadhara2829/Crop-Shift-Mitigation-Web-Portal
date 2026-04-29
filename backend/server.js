require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

// Connect Database
connectDB();

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Node Server running on port ${PORT}`);
});
