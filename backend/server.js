const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  // Test database connection
  await testConnection();

  app.listen(PORT, () => {
    console.log(`
🚀 Server is running!
📍 URL: http://localhost:${PORT}
📍 API: http://localhost:${PORT}/api

Auth Routes:
  POST /api/auth/register  - Register new user
  POST /api/auth/login     - Login user
  GET  /api/auth/user      - Get current user (requires token)
  POST /api/auth/logout    - Logout user (requires token)

Admin Routes (requires admin token):
  GET  /api/admin/dashboard/stats     - Dashboard statistics
  GET  /api/admin/dashboard/charts    - Chart data
  GET  /api/admin/customers           - List customers
  GET  /api/admin/transactions        - List transactions
  GET  /api/admin/invoices            - List invoices
  GET  /api/admin/tickets             - List support tickets
  GET  /api/admin/templates           - List templates
  GET  /api/admin/blogs               - List blogs
  GET  /api/admin/email/templates     - List email templates
  GET  /api/admin/activity-logs       - Activity logs
  GET  /api/admin/settings            - Settings

Health Check:
  GET  /api/health                    - Server health check
    `);
  });
};

startServer();
