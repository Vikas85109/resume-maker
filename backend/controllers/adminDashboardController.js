const { getPool } = require('../config/database');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const pool = getPool();

    // Get user statistics
    const [userStats] = await pool.query(`
      SELECT
        COUNT(*) as total_users,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_users,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today_signups,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as week_signups,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as month_signups
      FROM users WHERE role = 'user'
    `);

    // Get revenue statistics
    const [revenueStats] = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN status = 'completed' AND DATE(created_at) = CURDATE() THEN amount ELSE 0 END), 0) as today_revenue,
        COALESCE(SUM(CASE WHEN status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN amount ELSE 0 END), 0) as week_revenue,
        COALESCE(SUM(CASE WHEN status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN amount ELSE 0 END), 0) as month_revenue,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as total_transactions,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_transactions
      FROM transactions
    `);

    // Get support ticket statistics
    const [ticketStats] = await pool.query(`
      SELECT
        COUNT(*) as total_tickets,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_tickets,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tickets,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_tickets,
        SUM(CASE WHEN priority = 'urgent' AND status NOT IN ('resolved', 'closed') THEN 1 ELSE 0 END) as urgent_tickets
      FROM support_tickets
    `);

    // Get resume statistics
    const [resumeStats] = await pool.query(`
      SELECT
        COUNT(*) as total_resumes,
        SUM(download_count) as total_downloads,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today_resumes
      FROM resumes
    `);

    // Get recent signups (last 7 days by day)
    const [signupTrend] = await pool.query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Get revenue trend (last 7 days)
    const [revenueTrend] = await pool.query(`
      SELECT
        DATE(created_at) as date,
        COALESCE(SUM(amount), 0) as amount
      FROM transactions
      WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Get recent activities
    const [recentActivities] = await pool.query(`
      SELECT
        al.id,
        al.action,
        al.entity_type,
        al.entity_id,
        al.created_at,
        u.name as user_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        users: userStats[0],
        revenue: revenueStats[0],
        tickets: ticketStats[0],
        resumes: resumeStats[0],
        trends: {
          signups: signupTrend,
          revenue: revenueTrend
        },
        recentActivities
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get chart data for specific period
const getChartData = async (req, res) => {
  try {
    const { period = '30', type = 'signups' } = req.query;
    const days = parseInt(period);
    const pool = getPool();

    let query;
    if (type === 'signups') {
      query = `
        SELECT
          DATE(created_at) as date,
          COUNT(*) as value
        FROM users
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
    } else if (type === 'revenue') {
      query = `
        SELECT
          DATE(created_at) as date,
          COALESCE(SUM(amount), 0) as value
        FROM transactions
        WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
    } else if (type === 'resumes') {
      query = `
        SELECT
          DATE(created_at) as date,
          COUNT(*) as value
        FROM resumes
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
    } else if (type === 'tickets') {
      query = `
        SELECT
          DATE(created_at) as date,
          COUNT(*) as value
        FROM support_tickets
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
    }

    const [data] = await pool.query(query, [days]);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data'
    });
  }
};

// Get system overview
const getSystemOverview = async (req, res) => {
  try {
    const pool = getPool();

    // Get template usage stats
    const [templateStats] = await pool.query(`
      SELECT
        t.template_id,
        t.name,
        t.is_premium,
        t.is_active,
        COUNT(r.id) as usage_count
      FROM templates t
      LEFT JOIN resumes r ON t.template_id = r.template_id
      GROUP BY t.id
      ORDER BY usage_count DESC
    `);

    // Get plan subscription stats
    const [planStats] = await pool.query(`
      SELECT
        pp.name,
        pp.slug,
        pp.price,
        COUNT(t.id) as subscriptions
      FROM pricing_plans pp
      LEFT JOIN transactions t ON pp.id = t.plan_id AND t.status = 'completed'
      GROUP BY pp.id
    `);

    // Get active blogs count
    const [blogStats] = await pool.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts
      FROM blogs
    `);

    res.json({
      success: true,
      data: {
        templates: templateStats,
        plans: planStats,
        blogs: blogStats[0]
      }
    });
  } catch (error) {
    console.error('System overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system overview'
    });
  }
};

module.exports = {
  getDashboardStats,
  getChartData,
  getSystemOverview
};
