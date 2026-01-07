const { getPool } = require('../config/database');
const { logActivity } = require('../middleware/adminAuth');
const { sendCustomEmail, sendTemplateEmail } = require('../services/emailService');

// Get all email templates
const getEmailTemplates = async (req, res) => {
  try {
    const pool = getPool();

    const [templates] = await pool.query(
      'SELECT * FROM email_templates ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get email templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email templates'
    });
  }
};

// Get single email template
const getEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [templates] = await pool.query(
      'SELECT * FROM email_templates WHERE id = ?',
      [id]
    );

    if (templates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    res.json({
      success: true,
      data: templates[0]
    });
  } catch (error) {
    console.error('Get email template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email template'
    });
  }
};

// Create email template
const createEmailTemplate = async (req, res) => {
  try {
    const { name, slug, subject, body, variables } = req.body;
    const pool = getPool();

    if (!name || !slug || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug, subject, and body are required'
      });
    }

    // Check if slug exists
    const [existing] = await pool.query('SELECT id FROM email_templates WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Template with this slug already exists'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO email_templates (name, slug, subject, body, variables)
       VALUES (?, ?, ?, ?, ?)`,
      [name, slug, subject, body, variables ? JSON.stringify(variables) : null]
    );

    await logActivity(req.userId, 'create_email_template', 'email_template', result.insertId, null, { name, slug }, req);

    res.status(201).json({
      success: true,
      message: 'Email template created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create email template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create email template'
    });
  }
};

// Update email template
const updateEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, body, variables, is_active } = req.body;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM email_templates WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    await pool.query(
      `UPDATE email_templates SET
        name = COALESCE(?, name),
        subject = COALESCE(?, subject),
        body = COALESCE(?, body),
        variables = COALESCE(?, variables),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [name, subject, body, variables ? JSON.stringify(variables) : current[0].variables, is_active, id]
    );

    await logActivity(req.userId, 'update_email_template', 'email_template', id, current[0], { name, subject }, req);

    res.json({
      success: true,
      message: 'Email template updated successfully'
    });
  } catch (error) {
    console.error('Update email template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update email template'
    });
  }
};

// Delete email template
const deleteEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM email_templates WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    await pool.query('DELETE FROM email_templates WHERE id = ?', [id]);
    await logActivity(req.userId, 'delete_email_template', 'email_template', id, current[0], null, req);

    res.json({
      success: true,
      message: 'Email template deleted successfully'
    });
  } catch (error) {
    console.error('Delete email template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete email template'
    });
  }
};

// Get email logs
const getEmailLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = '',
      search = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const pool = getPool();

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (status) {
      whereClause += ' AND el.status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND (el.to_email LIKE ? OR el.subject LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM email_logs el ${whereClause}`,
      params
    );

    const [logs] = await pool.query(
      `SELECT el.*, u.name as user_name, et.name as template_name
       FROM email_logs el
       LEFT JOIN users u ON el.user_id = u.id
       LEFT JOIN email_templates et ON el.template_id = et.id
       ${whereClause}
       ORDER BY el.created_at DESC
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
    console.error('Get email logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email logs'
    });
  }
};

// Send test email
const sendTestEmail = async (req, res) => {
  try {
    const { templateId, toEmail, variables } = req.body;
    const pool = getPool();

    if (!toEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    if (templateId) {
      // Send template email
      const [templates] = await pool.query('SELECT slug FROM email_templates WHERE id = ?', [templateId]);
      if (templates.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      const result = await sendTemplateEmail(templates[0].slug, toEmail, variables || {}, req.userId);
      res.json(result);
    } else {
      // Send custom test email
      const result = await sendCustomEmail(
        toEmail,
        'Test Email from ResumeBuilder',
        '<h1>Test Email</h1><p>This is a test email from your ResumeBuilder admin panel.</p>',
        req.userId
      );
      res.json(result);
    }
  } catch (error) {
    console.error('Send test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email'
    });
  }
};

// Send bulk email
const sendBulkEmail = async (req, res) => {
  try {
    const { userIds, templateSlug, subject, body, variables } = req.body;
    const pool = getPool();

    if (!userIds || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one user is required'
      });
    }

    // Get users
    const [users] = await pool.query(
      'SELECT id, name, email FROM users WHERE id IN (?) AND status = "active"',
      [userIds]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active users found'
      });
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: []
    };

    for (const user of users) {
      try {
        const userVariables = {
          ...variables,
          name: user.name,
          email: user.email
        };

        let result;
        if (templateSlug) {
          result = await sendTemplateEmail(templateSlug, user.email, userVariables, user.id);
        } else if (subject && body) {
          result = await sendCustomEmail(user.email, subject, body, user.id);
        } else {
          throw new Error('Either template or subject/body required');
        }

        if (result.success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push({ email: user.email, error: result.message });
        }
      } catch (err) {
        results.failed++;
        results.errors.push({ email: user.email, error: err.message });
      }
    }

    await logActivity(req.userId, 'send_bulk_email', 'email', null, null, { count: results.sent }, req);

    res.json({
      success: true,
      message: `Emails sent: ${results.sent}, Failed: ${results.failed}`,
      data: results
    });
  } catch (error) {
    console.error('Send bulk email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk email'
    });
  }
};

// Get email stats
const getEmailStats = async (req, res) => {
  try {
    const pool = getPool();

    const [stats] = await pool.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM email_logs
    `);

    // Emails by day (last 7 days)
    const [byDay] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count, status
      FROM email_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at), status
      ORDER BY date ASC
    `);

    // Most used templates
    const [byTemplate] = await pool.query(`
      SELECT et.name, COUNT(el.id) as count
      FROM email_logs el
      JOIN email_templates et ON el.template_id = et.id
      GROUP BY el.template_id
      ORDER BY count DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        byDay,
        byTemplate
      }
    });
  } catch (error) {
    console.error('Get email stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email statistics'
    });
  }
};

module.exports = {
  getEmailTemplates,
  getEmailTemplate,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  getEmailLogs,
  sendTestEmail,
  sendBulkEmail,
  getEmailStats
};
