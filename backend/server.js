const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/complaints', require('./routes/complaints'));
app.use('/api/v1/admin', require('./routes/admin'));
app.use('/api/v1/assignments', require('./routes/assignments'));
app.use('/api/v1/notifications', require('./routes/notifications'));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'CivicAid API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api/v1`);
});


