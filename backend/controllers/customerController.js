const { getPool } = require('../config/database');
const bcrypt = require('bcryptjs');
const { logActivity } = require('../middleware/adminAuth');

// Get all customers with pagination and filters
const getCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const pool = getPool();

    // Build WHERE clause
    let whereClause = "WHERE role = 'user'";
    const params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Validate sort column
    const allowedSortColumns = ['id', 'name', 'email', 'status', 'created_at', 'last_login'];
    const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    // Get customers
    const [customers] = await pool.query(
      `SELECT id, name, email, role, status, phone, avatar, last_login, created_at, updated_at
       FROM users ${whereClause}
       ORDER BY ${sortColumn} ${order}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    // Get additional stats for each customer
    for (let customer of customers) {
      const [resumeCount] = await pool.query(
        'SELECT COUNT(*) as count FROM resumes WHERE user_id = ?',
        [customer.id]
      );
      const [transactionSum] = await pool.query(
        'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND status = "completed"',
        [customer.id]
      );
      customer.resume_count = resumeCount[0].count;
      customer.total_spent = transactionSum[0].total;
    }

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers'
    });
  }
};

// Get single customer details
const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [customers] = await pool.query(
      `SELECT id, name, email, role, status, phone, avatar, last_login, created_at, updated_at
       FROM users WHERE id = ? AND role = 'user'`,
      [id]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const customer = customers[0];

    // Get customer's resumes
    const [resumes] = await pool.query(
      'SELECT id, title, template_id, is_draft, download_count, created_at FROM resumes WHERE user_id = ? ORDER BY created_at DESC',
      [id]
    );

    // Get customer's transactions
    const [transactions] = await pool.query(
      `SELECT t.*, pp.name as plan_name
       FROM transactions t
       LEFT JOIN pricing_plans pp ON t.plan_id = pp.id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [id]
    );

    // Get customer's support tickets
    const [tickets] = await pool.query(
      'SELECT id, ticket_number, subject, status, priority, created_at FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({
      success: true,
      data: {
        customer,
        resumes,
        transactions,
        tickets
      }
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer details'
    });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status } = req.body;
    const pool = getPool();

    // Get current customer data
    const [current] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check email uniqueness if changed
    if (email && email !== current[0].email) {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update customer
    await pool.query(
      `UPDATE users SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [name, email, phone, status, id]
    );

    // Log activity
    await logActivity(req.userId, 'update_customer', 'user', id, current[0], { name, email, phone, status }, req);

    const [updated] = await pool.query(
      'SELECT id, name, email, role, status, phone, avatar, last_login, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer'
    });
  }
};

// Suspend customer
const suspendCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await pool.query('UPDATE users SET status = "suspended" WHERE id = ?', [id]);
    await logActivity(req.userId, 'suspend_customer', 'user', id, { status: current[0].status }, { status: 'suspended' }, req);

    res.json({
      success: true,
      message: 'Customer suspended successfully'
    });
  } catch (error) {
    console.error('Suspend customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to suspend customer'
    });
  }
};

// Activate customer
const activateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await pool.query('UPDATE users SET status = "active" WHERE id = ?', [id]);
    await logActivity(req.userId, 'activate_customer', 'user', id, { status: current[0].status }, { status: 'active' }, req);

    res.json({
      success: true,
      message: 'Customer activated successfully'
    });
  } catch (error) {
    console.error('Activate customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate customer'
    });
  }
};

// Delete customer (soft delete)
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await pool.query('UPDATE users SET status = "deleted" WHERE id = ?', [id]);
    await logActivity(req.userId, 'delete_customer', 'user', id, { status: current[0].status }, { status: 'deleted' }, req);

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer'
    });
  }
};

// Reset customer password
const resetCustomerPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const pool = getPool();

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const [current] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    await logActivity(req.userId, 'reset_password', 'user', id, null, null, req);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  updateCustomer,
  suspendCustomer,
  activateCustomer,
  deleteCustomer,
  resetCustomerPassword
};
