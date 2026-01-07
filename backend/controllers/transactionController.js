const { getPool } = require('../config/database');
const { logActivity } = require('../middleware/adminAuth');

// Get all transactions with pagination and filters
const getTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      startDate = '',
      endDate = '',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const pool = getPool();

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.email LIKE ? OR t.transaction_id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND t.status = ?';
      params.push(status);
    }

    if (startDate) {
      whereClause += ' AND DATE(t.created_at) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ' AND DATE(t.created_at) <= ?';
      params.push(endDate);
    }

    const allowedSortColumns = ['id', 'amount', 'status', 'created_at'];
    const sortColumn = allowedSortColumns.includes(sortBy) ? `t.${sortBy}` : 't.created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       ${whereClause}`,
      params
    );

    // Get transactions
    const [transactions] = await pool.query(
      `SELECT t.*, u.name as user_name, u.email as user_email, pp.name as plan_name
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN pricing_plans pp ON t.plan_id = pp.id
       ${whereClause}
       ORDER BY ${sortColumn} ${order}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
};

// Get single transaction
const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [transactions] = await pool.query(
      `SELECT t.*, u.name as user_name, u.email as user_email, pp.name as plan_name, pp.features as plan_features
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN pricing_plans pp ON t.plan_id = pp.id
       WHERE t.id = ?`,
      [id]
    );

    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Get related invoice if exists
    const [invoices] = await pool.query(
      'SELECT * FROM invoices WHERE transaction_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: {
        transaction: transactions[0],
        invoice: invoices[0] || null
      }
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction'
    });
  }
};

// Update transaction status
const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pool = getPool();

    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const [current] = await pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    await pool.query('UPDATE transactions SET status = ? WHERE id = ?', [status, id]);
    await logActivity(req.userId, 'update_transaction_status', 'transaction', id,
      { status: current[0].status }, { status }, req);

    res.json({
      success: true,
      message: 'Transaction status updated'
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction'
    });
  }
};

// Get all invoices
const getInvoices = async (req, res) => {
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

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.email LIKE ? OR i.invoice_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND i.status = ?';
      params.push(status);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM invoices i
       LEFT JOIN users u ON i.user_id = u.id
       ${whereClause}`,
      params
    );

    const [invoices] = await pool.query(
      `SELECT i.*, u.name as user_name, u.email as user_email
       FROM invoices i
       LEFT JOIN users u ON i.user_id = u.id
       ${whereClause}
       ORDER BY i.${sortBy} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices'
    });
  }
};

// Get single invoice
const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [invoices] = await pool.query(
      `SELECT i.*, u.name as user_name, u.email as user_email, t.razorpay_payment_id, t.payment_method
       FROM invoices i
       LEFT JOIN users u ON i.user_id = u.id
       LEFT JOIN transactions t ON i.transaction_id = t.id
       WHERE i.id = ?`,
      [id]
    );

    if (invoices.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoices[0]
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice'
    });
  }
};

// Export transactions as CSV
const exportTransactions = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const pool = getPool();

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (status) {
      whereClause += ' AND t.status = ?';
      params.push(status);
    }

    if (startDate) {
      whereClause += ' AND DATE(t.created_at) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      whereClause += ' AND DATE(t.created_at) <= ?';
      params.push(endDate);
    }

    const [transactions] = await pool.query(
      `SELECT t.id, t.transaction_id, u.name as user_name, u.email as user_email,
              pp.name as plan_name, t.amount, t.currency, t.status,
              t.payment_method, t.created_at
       FROM transactions t
       LEFT JOIN users u ON t.user_id = u.id
       LEFT JOIN pricing_plans pp ON t.plan_id = pp.id
       ${whereClause}
       ORDER BY t.created_at DESC`,
      params
    );

    // Generate CSV
    const headers = ['ID', 'Transaction ID', 'User Name', 'User Email', 'Plan', 'Amount', 'Currency', 'Status', 'Payment Method', 'Date'];
    const csvRows = [headers.join(',')];

    for (const t of transactions) {
      const row = [
        t.id,
        t.transaction_id || '',
        `"${t.user_name || ''}"`,
        t.user_email || '',
        t.plan_name || '',
        t.amount,
        t.currency,
        t.status,
        t.payment_method || '',
        t.created_at
      ];
      csvRows.push(row.join(','));
    }

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export transactions'
    });
  }
};

// Get revenue analytics
const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const pool = getPool();

    // Revenue by day
    const [dailyRevenue] = await pool.query(`
      SELECT DATE(created_at) as date, SUM(amount) as revenue, COUNT(*) as transactions
      FROM transactions
      WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [days]);

    // Revenue by plan
    const [planRevenue] = await pool.query(`
      SELECT pp.name, pp.slug, SUM(t.amount) as revenue, COUNT(t.id) as transactions
      FROM transactions t
      JOIN pricing_plans pp ON t.plan_id = pp.id
      WHERE t.status = 'completed' AND t.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY pp.id
    `, [days]);

    // Revenue by payment method
    const [methodRevenue] = await pool.query(`
      SELECT payment_method, SUM(amount) as revenue, COUNT(*) as transactions
      FROM transactions
      WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY payment_method
    `, [days]);

    // Summary stats
    const [summary] = await pool.query(`
      SELECT
        SUM(amount) as total_revenue,
        COUNT(*) as total_transactions,
        AVG(amount) as avg_transaction
      FROM transactions
      WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `, [days]);

    res.json({
      success: true,
      data: {
        daily: dailyRevenue,
        byPlan: planRevenue,
        byMethod: methodRevenue,
        summary: summary[0]
      }
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue analytics'
    });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  updateTransactionStatus,
  getInvoices,
  getInvoice,
  exportTransactions,
  getRevenueAnalytics
};
