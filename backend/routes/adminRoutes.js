const express = require('express');
const router = express.Router();

const { adminAuth, superAdminAuth } = require('../middleware/adminAuth');

// Controllers
const dashboardController = require('../controllers/adminDashboardController');
const customerController = require('../controllers/customerController');
const transactionController = require('../controllers/transactionController');
const supportController = require('../controllers/supportController');
const templateController = require('../controllers/templateController');
const blogController = require('../controllers/blogController');
const emailController = require('../controllers/emailController');

// ==================== DASHBOARD ROUTES ====================
router.get('/dashboard/stats', adminAuth, dashboardController.getDashboardStats);
router.get('/dashboard/charts', adminAuth, dashboardController.getChartData);
router.get('/dashboard/overview', adminAuth, dashboardController.getSystemOverview);

// ==================== CUSTOMER ROUTES ====================
router.get('/customers', adminAuth, customerController.getCustomers);
router.get('/customers/:id', adminAuth, customerController.getCustomer);
router.put('/customers/:id', adminAuth, customerController.updateCustomer);
router.post('/customers/:id/suspend', adminAuth, customerController.suspendCustomer);
router.post('/customers/:id/activate', adminAuth, customerController.activateCustomer);
router.delete('/customers/:id', superAdminAuth, customerController.deleteCustomer);
router.post('/customers/:id/reset-password', adminAuth, customerController.resetCustomerPassword);

// ==================== TRANSACTION ROUTES ====================
router.get('/transactions', adminAuth, transactionController.getTransactions);
router.get('/transactions/export', adminAuth, transactionController.exportTransactions);
router.get('/transactions/analytics', adminAuth, transactionController.getRevenueAnalytics);
router.get('/transactions/:id', adminAuth, transactionController.getTransaction);
router.patch('/transactions/:id/status', adminAuth, transactionController.updateTransactionStatus);

// ==================== INVOICE ROUTES ====================
router.get('/invoices', adminAuth, transactionController.getInvoices);
router.get('/invoices/:id', adminAuth, transactionController.getInvoice);

// ==================== SUPPORT TICKET ROUTES ====================
router.get('/tickets', adminAuth, supportController.getTickets);
router.get('/tickets/stats', adminAuth, supportController.getTicketStats);
router.get('/tickets/:id', adminAuth, supportController.getTicket);
router.patch('/tickets/:id/status', adminAuth, supportController.updateTicketStatus);
router.patch('/tickets/:id/priority', adminAuth, supportController.updateTicketPriority);
router.post('/tickets/:id/assign', adminAuth, supportController.assignTicket);
router.post('/tickets/:id/reply', adminAuth, supportController.replyToTicket);

// ==================== TEMPLATE ROUTES ====================
router.get('/templates', adminAuth, templateController.getTemplates);
router.get('/templates/stats', adminAuth, templateController.getTemplateStats);
router.get('/templates/:id', adminAuth, templateController.getTemplate);
router.post('/templates', adminAuth, templateController.createTemplate);
router.put('/templates/:id', adminAuth, templateController.updateTemplate);
router.patch('/templates/:id/toggle', adminAuth, templateController.toggleTemplateStatus);
router.delete('/templates/:id', superAdminAuth, templateController.deleteTemplate);

// ==================== BLOG ROUTES ====================
router.get('/blogs', adminAuth, blogController.getBlogs);
router.get('/blogs/stats', adminAuth, blogController.getBlogStats);
router.get('/blogs/categories', adminAuth, blogController.getCategories);
router.get('/blogs/:id', adminAuth, blogController.getBlog);
router.post('/blogs', adminAuth, blogController.createBlog);
router.put('/blogs/:id', adminAuth, blogController.updateBlog);
router.post('/blogs/:id/publish', adminAuth, blogController.publishBlog);
router.post('/blogs/:id/unpublish', adminAuth, blogController.unpublishBlog);
router.delete('/blogs/:id', adminAuth, blogController.deleteBlog);

// ==================== EMAIL ROUTES ====================
router.get('/email/templates', adminAuth, emailController.getEmailTemplates);
router.get('/email/templates/:id', adminAuth, emailController.getEmailTemplate);
router.post('/email/templates', adminAuth, emailController.createEmailTemplate);
router.put('/email/templates/:id', adminAuth, emailController.updateEmailTemplate);
router.delete('/email/templates/:id', superAdminAuth, emailController.deleteEmailTemplate);
router.get('/email/logs', adminAuth, emailController.getEmailLogs);
router.get('/email/stats', adminAuth, emailController.getEmailStats);
router.post('/email/test', adminAuth, emailController.sendTestEmail);
router.post('/email/bulk', adminAuth, emailController.sendBulkEmail);

// ==================== SETTINGS ROUTES ====================
router.get('/settings', adminAuth, async (req, res) => {
  try {
    const { getPool } = require('../config/database');
    const pool = getPool();
    const [settings] = await pool.query('SELECT * FROM settings ORDER BY category, setting_key');
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

router.put('/settings/:key', superAdminAuth, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const { getPool } = require('../config/database');
    const pool = getPool();

    await pool.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [key, value, value]
    );

    res.json({ success: true, message: 'Setting updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update setting' });
  }
});

// ==================== ACTIVITY LOG ROUTES ====================
router.get('/activity-logs', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, userId = '', action = '' } = req.query;
    const offset = (page - 1) * limit;
    const { getPool } = require('../config/database');
    const pool = getPool();

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (userId) {
      whereClause += ' AND al.user_id = ?';
      params.push(userId);
    }

    if (action) {
      whereClause += ' AND al.action LIKE ?';
      params.push(`%${action}%`);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM activity_logs al ${whereClause}`,
      params
    );

    const [logs] = await pool.query(
      `SELECT al.*, u.name as user_name, u.email as user_email
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ${whereClause}
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch activity logs' });
  }
});

// ==================== ADMIN USER MANAGEMENT ====================
router.get('/admins', superAdminAuth, async (req, res) => {
  try {
    const { getPool } = require('../config/database');
    const pool = getPool();

    const [admins] = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE role IN ("admin", "superadmin") ORDER BY created_at DESC'
    );

    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admins' });
  }
});

router.post('/admins', superAdminAuth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const bcrypt = require('bcryptjs');
    const { getPool } = require('../config/database');
    const pool = getPool();

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const validRoles = ['admin', 'superadmin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'admin']
    );

    res.status(201).json({
      success: true,
      message: 'Admin user created',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create admin' });
  }
});

router.delete('/admins/:id', superAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { getPool } = require('../config/database');
    const pool = getPool();

    // Prevent deleting yourself
    if (parseInt(id) === req.userId) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const [admin] = await pool.query('SELECT * FROM users WHERE id = ? AND role IN ("admin", "superadmin")', [id]);
    if (admin.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete admin' });
  }
});

module.exports = router;
