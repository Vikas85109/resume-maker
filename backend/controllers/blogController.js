const { getPool } = require('../config/database');
const { logActivity } = require('../middleware/adminAuth');

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Get all blogs with pagination and filters
const getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      category = '',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const pool = getPool();

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (b.title LIKE ? OR b.excerpt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND b.status = ?';
      params.push(status);
    }

    if (category) {
      whereClause += ' AND b.category = ?';
      params.push(category);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM blogs b ${whereClause}`,
      params
    );

    const [blogs] = await pool.query(
      `SELECT b.*, u.name as author_name
       FROM blogs b
       LEFT JOIN users u ON b.author_id = u.id
       ${whereClause}
       ORDER BY b.${sortBy} ${sortOrder}
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          total: countResult[0].total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs'
    });
  }
};

// Get single blog
const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [blogs] = await pool.query(
      `SELECT b.*, u.name as author_name, u.email as author_email
       FROM blogs b
       LEFT JOIN users u ON b.author_id = u.id
       WHERE b.id = ?`,
      [id]
    );

    if (blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: blogs[0]
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog'
    });
  }
};

// Create blog
const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category,
      tags,
      status,
      meta_title,
      meta_description
    } = req.body;

    const pool = getPool();

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Generate slug if not provided
    let finalSlug = slug || generateSlug(title);

    // Check if slug exists
    const [existing] = await pool.query('SELECT id FROM blogs WHERE slug = ?', [finalSlug]);
    if (existing.length > 0) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    const [result] = await pool.query(
      `INSERT INTO blogs (author_id, title, slug, excerpt, content, featured_image, category, tags, status, meta_title, meta_description, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        title,
        finalSlug,
        excerpt || null,
        content,
        featured_image || null,
        category || null,
        tags ? JSON.stringify(tags) : null,
        status || 'draft',
        meta_title || title,
        meta_description || excerpt,
        status === 'published' ? new Date() : null
      ]
    );

    await logActivity(req.userId, 'create_blog', 'blog', result.insertId, null, { title, slug: finalSlug, status }, req);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { id: result.insertId, slug: finalSlug }
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog'
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category,
      tags,
      status,
      meta_title,
      meta_description
    } = req.body;

    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check slug uniqueness if changed
    if (slug && slug !== current[0].slug) {
      const [existing] = await pool.query('SELECT id FROM blogs WHERE slug = ? AND id != ?', [slug, id]);
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists'
        });
      }
    }

    // Set published_at if publishing for first time
    let publishedAt = current[0].published_at;
    if (status === 'published' && !current[0].published_at) {
      publishedAt = new Date();
    }

    await pool.query(
      `UPDATE blogs SET
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        excerpt = COALESCE(?, excerpt),
        content = COALESCE(?, content),
        featured_image = COALESCE(?, featured_image),
        category = COALESCE(?, category),
        tags = COALESCE(?, tags),
        status = COALESCE(?, status),
        meta_title = COALESCE(?, meta_title),
        meta_description = COALESCE(?, meta_description),
        published_at = ?
       WHERE id = ?`,
      [
        title, slug, excerpt, content, featured_image, category,
        tags ? JSON.stringify(tags) : current[0].tags,
        status, meta_title, meta_description, publishedAt, id
      ]
    );

    await logActivity(req.userId, 'update_blog', 'blog', id, current[0], { title, slug, status }, req);

    res.json({
      success: true,
      message: 'Blog updated successfully'
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog'
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    await logActivity(req.userId, 'delete_blog', 'blog', id, current[0], null, req);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog'
    });
  }
};

// Publish blog
const publishBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await pool.query(
      'UPDATE blogs SET status = "published", published_at = COALESCE(published_at, NOW()) WHERE id = ?',
      [id]
    );

    await logActivity(req.userId, 'publish_blog', 'blog', id, { status: current[0].status }, { status: 'published' }, req);

    res.json({
      success: true,
      message: 'Blog published successfully'
    });
  } catch (error) {
    console.error('Publish blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish blog'
    });
  }
};

// Unpublish blog (set to draft)
const unpublishBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const [current] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await pool.query('UPDATE blogs SET status = "draft" WHERE id = ?', [id]);

    await logActivity(req.userId, 'unpublish_blog', 'blog', id, { status: current[0].status }, { status: 'draft' }, req);

    res.json({
      success: true,
      message: 'Blog unpublished successfully'
    });
  } catch (error) {
    console.error('Unpublish blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unpublish blog'
    });
  }
};

// Get blog categories
const getCategories = async (req, res) => {
  try {
    const pool = getPool();

    const [categories] = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM blogs
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

// Get blog stats
const getBlogStats = async (req, res) => {
  try {
    const pool = getPool();

    const [stats] = await pool.query(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as drafts,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
        SUM(views) as total_views
      FROM blogs
    `);

    // Most viewed blogs
    const [mostViewed] = await pool.query(`
      SELECT id, title, slug, views
      FROM blogs
      WHERE status = 'published'
      ORDER BY views DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        mostViewed
      }
    });
  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog statistics'
    });
  }
};

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getCategories,
  getBlogStats
};
