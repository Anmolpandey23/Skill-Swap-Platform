const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const swapsRoutes = require('./routes/swaps');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Authentication server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/swaps', swapsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Authentication server running on port ${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST /api/auth/signup - Register a new user`);
  console.log(`   POST /api/auth/signin - Sign in user`);
  console.log(`   POST /api/auth/signout - Sign out user`);
  console.log(`   GET  /api/auth/me - Get current user (protected)`);
  console.log(`   POST /api/auth/refresh - Refresh access token`);
  console.log(`   POST /api/auth/reset-password - Send password reset email`);
  console.log(`   PUT  /api/auth/profile - Update user profile (protected)`);
  console.log(`   GET  /health - Health check`);
}); 