const { getPool } = require('../config/database');
const { logActivity } = require('../middleware/adminAuth');

// Get all templates
const getTemplates = async (req, res) => {
  try {
    const { category = '', status = '' } = req.query;
    const pool = getPool();

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    if (status === 'active') {
      whereClause += ' AND is_active = TRUE';
    } else if (status === 'inactive') {
      whereClause += ' AND is_active = FALSE';
    }

    const [templates] = await pool.query(
      `SELECT t.*,
              (SELECT COUNT(*) FROM resumes WHERE template_id = t.template_id) as actual_usage
       FROM templates t
       ${whereClause}
       ORDER BY t.name ASC`,
      params
    );

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates'
    });
  }
};

// Get single template
const getTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [templates] = await pool.query(
      `SELECT t.*,
              (SELECT COUNT(*) FROM resumes WHERE template_id = t.template_id) as actual_usage
       FROM templates t
       WHERE t.id = ?`,
      [id]
    );

    if (templates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Get usage statistics
    const [usageByMonth] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
      FROM resumes
      WHERE template_id = ?
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `, [templates[0].template_id]);

    res.json({
      success: true,
      data: {
        template: templates[0],
        usageByMonth
      }
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template'
    });
  }
};

// Create template
const createTemplate = async (req, res) => {
  try {
    const { template_id, name, description, category, thumbnail, is_premium } = req.body;
    const pool = getPool();

    if (!template_id || !name) {
      return res.status(400).json({
        success: false,
        message: 'Template ID and name are required'
      });
    }

    // Check if template_id already exists
    const [existing] = await pool.query('SELECT id FROM templates WHERE template_id = ?', [template_id]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Template ID already exists'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO templates (template_id, name, description, category, thumbnail, is_premium)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [template_id, name, description || null, category || 'professional', thumbnail || null, is_premium || false]
    );

    await logActivity(req.userId, 'create_template', 'template', result.insertId, null, { template_id, name }, req);

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create template'
    });
  }
};

// Update template
const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, thumbnail, is_premium } = req.body;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM templates WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    await pool.query(
      `UPDATE templates SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        thumbnail = COALESCE(?, thumbnail),
        is_premium = COALESCE(?, is_premium)
       WHERE id = ?`,
      [name, description, category, thumbnail, is_premium, id]
    );

    await logActivity(req.userId, 'update_template', 'template', id, current[0], { name, description, category, is_premium }, req);

    res.json({
      success: true,
      message: 'Template updated successfully'
    });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update template'
    });
  }
};

// Toggle template status (enable/disable)
const toggleTemplateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM templates WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    const newStatus = !current[0].is_active;
    await pool.query('UPDATE templates SET is_active = ? WHERE id = ?', [newStatus, id]);

    await logActivity(req.userId, newStatus ? 'enable_template' : 'disable_template', 'template', id,
      { is_active: current[0].is_active }, { is_active: newStatus }, req);

    res.json({
      success: true,
      message: `Template ${newStatus ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Toggle template status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update template status'
    });
  }
};

// Delete template
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM templates WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Check if template is in use
    const [usage] = await pool.query('SELECT COUNT(*) as count FROM resumes WHERE template_id = ?', [current[0].template_id]);
    if (usage[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete template. It is used by ${usage[0].count} resume(s). Consider disabling it instead.`
      });
    }

    await pool.query('DELETE FROM templates WHERE id = ?', [id]);
    await logActivity(req.userId, 'delete_template', 'template', id, current[0], null, req);

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete template'
    });
  }
};

// Get template statistics
const getTemplateStats = async (req, res) => {
  try {
    const pool = getPool();

    const [stats] = await pool.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_premium = TRUE THEN 1 ELSE 0 END) as premium,
        SUM(CASE WHEN is_premium = FALSE THEN 1 ELSE 0 END) as free
      FROM templates
    `);

    // Most used templates
    const [mostUsed] = await pool.query(`
      SELECT t.template_id, t.name, COUNT(r.id) as usage_count
      FROM templates t
      LEFT JOIN resumes r ON t.template_id = r.template_id
      GROUP BY t.id
      ORDER BY usage_count DESC
      LIMIT 5
    `);

    // Usage by category
    const [byCategory] = await pool.query(`
      SELECT t.category, COUNT(r.id) as usage_count
      FROM templates t
      LEFT JOIN resumes r ON t.template_id = r.template_id
      GROUP BY t.category
    `);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        mostUsed,
        byCategory
      }
    });
  } catch (error) {
    console.error('Get template stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template statistics'
    });
  }
};

module.exports = {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  toggleTemplateStatus,
  deleteTemplate,
  getTemplateStats
};
