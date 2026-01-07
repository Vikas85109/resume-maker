const { getPool } = require('../config/database');
const { logActivity } = require('../middleware/adminAuth');

// Generate ticket number
const generateTicketNumber = () => {
  const prefix = 'TKT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// Get all tickets with pagination and filters
const getTickets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      priority = '',
      category = '',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const pool = getPool();

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (st.ticket_number LIKE ? OR st.subject LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND st.status = ?';
      params.push(status);
    }

    if (priority) {
      whereClause += ' AND st.priority = ?';
      params.push(priority);
    }

    if (category) {
      whereClause += ' AND st.category = ?';
      params.push(category);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM support_tickets st
       LEFT JOIN users u ON st.user_id = u.id
       ${whereClause}`,
      params
    );

    const [tickets] = await pool.query(
      `SELECT st.*, u.name as user_name, u.email as user_email,
              a.name as assigned_name,
              (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = st.id) as message_count
       FROM support_tickets st
       LEFT JOIN users u ON st.user_id = u.id
       LEFT JOIN users a ON st.assigned_to = a.id
       ${whereClause}
       ORDER BY st.${sortBy} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets'
    });
  }
};

// Get single ticket with messages
const getTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [tickets] = await pool.query(
      `SELECT st.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
              a.name as assigned_name
       FROM support_tickets st
       LEFT JOIN users u ON st.user_id = u.id
       LEFT JOIN users a ON st.assigned_to = a.id
       WHERE st.id = ?`,
      [id]
    );

    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Get messages
    const [messages] = await pool.query(
      `SELECT tm.*, u.name as sender_name, u.email as sender_email
       FROM ticket_messages tm
       LEFT JOIN users u ON tm.user_id = u.id
       WHERE tm.ticket_id = ?
       ORDER BY tm.created_at ASC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ticket: tickets[0],
        messages
      }
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket'
    });
  }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pool = getPool();

    const validStatuses = ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const [current] = await pool.query('SELECT * FROM support_tickets WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolved_at = new Date();
    }

    await pool.query(
      'UPDATE support_tickets SET status = ?, resolved_at = ? WHERE id = ?',
      [status, updateData.resolved_at || null, id]
    );

    await logActivity(req.userId, 'update_ticket_status', 'support_ticket', id,
      { status: current[0].status }, { status }, req);

    res.json({
      success: true,
      message: 'Ticket status updated'
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket status'
    });
  }
};

// Update ticket priority
const updateTicketPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    const pool = getPool();

    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority'
      });
    }

    const [current] = await pool.query('SELECT * FROM support_tickets WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    await pool.query('UPDATE support_tickets SET priority = ? WHERE id = ?', [priority, id]);

    await logActivity(req.userId, 'update_ticket_priority', 'support_ticket', id,
      { priority: current[0].priority }, { priority }, req);

    res.json({
      success: true,
      message: 'Ticket priority updated'
    });
  } catch (error) {
    console.error('Update ticket priority error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket priority'
    });
  }
};

// Assign ticket to admin
const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;
    const pool = getPool();

    // Verify admin exists and is admin
    if (adminId) {
      const [admin] = await pool.query(
        'SELECT id FROM users WHERE id = ? AND role IN ("admin", "superadmin")',
        [adminId]
      );
      if (admin.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid admin user'
        });
      }
    }

    const [current] = await pool.query('SELECT * FROM support_tickets WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    await pool.query('UPDATE support_tickets SET assigned_to = ? WHERE id = ?', [adminId || null, id]);

    await logActivity(req.userId, 'assign_ticket', 'support_ticket', id,
      { assigned_to: current[0].assigned_to }, { assigned_to: adminId }, req);

    res.json({
      success: true,
      message: adminId ? 'Ticket assigned successfully' : 'Ticket unassigned'
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign ticket'
    });
  }
};

// Reply to ticket
const replyToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const pool = getPool();

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const [ticket] = await pool.query('SELECT * FROM support_tickets WHERE id = ?', [id]);
    if (ticket.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Insert message
    await pool.query(
      'INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin_reply) VALUES (?, ?, ?, TRUE)',
      [id, req.userId, message]
    );

    // Update ticket status to in_progress if it was open
    if (ticket[0].status === 'open') {
      await pool.query('UPDATE support_tickets SET status = "in_progress" WHERE id = ?', [id]);
    }

    await logActivity(req.userId, 'reply_to_ticket', 'support_ticket', id, null, { message: message.substring(0, 100) }, req);

    res.json({
      success: true,
      message: 'Reply sent successfully'
    });
  } catch (error) {
    console.error('Reply to ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply'
    });
  }
};

// Get ticket statistics
const getTicketStats = async (req, res) => {
  try {
    const pool = getPool();

    const [stats] = await pool.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'waiting_customer' THEN 1 ELSE 0 END) as waiting_customer,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
        SUM(CASE WHEN priority = 'urgent' AND status NOT IN ('resolved', 'closed') THEN 1 ELSE 0 END) as urgent,
        SUM(CASE WHEN priority = 'high' AND status NOT IN ('resolved', 'closed') THEN 1 ELSE 0 END) as high_priority
      FROM support_tickets
    `);

    // Average resolution time
    const [avgTime] = await pool.query(`
      SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_resolution_hours
      FROM support_tickets
      WHERE status = 'resolved' AND resolved_at IS NOT NULL
    `);

    // Tickets by category
    const [byCategory] = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM support_tickets
      GROUP BY category
    `);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        avgResolutionHours: avgTime[0].avg_resolution_hours || 0,
        byCategory
      }
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket statistics'
    });
  }
};

module.exports = {
  getTickets,
  getTicket,
  updateTicketStatus,
  updateTicketPriority,
  assignTicket,
  replyToTicket,
  getTicketStats
};
