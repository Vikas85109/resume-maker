const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'resume_builder';

let pool;

// Initialize database and create tables
const initializeDatabase = async () => {
  try {
    // First, connect without database to create it if needed
    const initConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    // Create database if it doesn't exist
    await initConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' ready`);

    // Use the database
    await initConnection.query(`USE \`${DB_NAME}\``);

    // Create users table with role support
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin', 'superadmin') DEFAULT 'user',
        status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
        avatar VARCHAR(500) DEFAULT NULL,
        phone VARCHAR(20) DEFAULT NULL,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Add missing columns if they don't exist (for existing databases)
    const columnsToAdd = [
      { name: 'role', definition: "ENUM('user', 'admin', 'superadmin') DEFAULT 'user'" },
      { name: 'status', definition: "ENUM('active', 'suspended', 'deleted') DEFAULT 'active'" },
      { name: 'avatar', definition: 'VARCHAR(500) DEFAULT NULL' },
      { name: 'phone', definition: 'VARCHAR(20) DEFAULT NULL' },
      { name: 'last_login', definition: 'TIMESTAMP NULL' }
    ];

    for (const col of columnsToAdd) {
      try {
        await initConnection.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.definition}`);
        console.log(`✅ Added column ${col.name} to users table`);
      } catch (e) {
        // Column already exists, ignore
      }
    }
    console.log('✅ Users table ready');

    // Create templates table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        template_id VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category ENUM('ats', 'creative', 'professional', 'modern') DEFAULT 'professional',
        thumbnail VARCHAR(500) DEFAULT NULL,
        is_premium BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        usage_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Templates table ready');

    // Create resumes table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        template_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) DEFAULT 'Untitled Resume',
        resume_data JSON NOT NULL,
        is_draft BOOLEAN DEFAULT TRUE,
        download_count INT DEFAULT 0,
        last_edited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Resumes table ready');

    // Create pricing plans table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS pricing_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(50) NOT NULL UNIQUE,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        billing_type ENUM('one-time', 'monthly', 'yearly') DEFAULT 'one-time',
        features JSON,
        is_active BOOLEAN DEFAULT TRUE,
        is_popular BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Pricing plans table ready');

    // Create transactions table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plan_id INT DEFAULT NULL,
        transaction_id VARCHAR(100) UNIQUE,
        razorpay_order_id VARCHAR(100),
        razorpay_payment_id VARCHAR(100),
        razorpay_signature VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        description TEXT,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES pricing_plans(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Transactions table ready');

    // Create invoices table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        transaction_id INT,
        invoice_number VARCHAR(50) NOT NULL UNIQUE,
        amount DECIMAL(10, 2) NOT NULL,
        tax_amount DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        status ENUM('draft', 'sent', 'paid', 'cancelled') DEFAULT 'draft',
        billing_name VARCHAR(100),
        billing_email VARCHAR(255),
        billing_address TEXT,
        notes TEXT,
        due_date DATE,
        paid_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Invoices table ready');

    // Create support tickets table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        ticket_number VARCHAR(20) NOT NULL UNIQUE,
        subject VARCHAR(255) NOT NULL,
        category ENUM('general', 'technical', 'billing', 'feature_request', 'bug_report') DEFAULT 'general',
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        status ENUM('open', 'in_progress', 'waiting_customer', 'resolved', 'closed') DEFAULT 'open',
        assigned_to INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Support tickets table ready');

    // Create ticket messages table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS ticket_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ticket_id INT NOT NULL,
        user_id INT,
        message TEXT NOT NULL,
        is_admin_reply BOOLEAN DEFAULT FALSE,
        attachments JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Ticket messages table ready');

    // Create blogs table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        author_id INT,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT,
        content LONGTEXT NOT NULL,
        featured_image VARCHAR(500),
        category VARCHAR(100),
        tags JSON,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        views INT DEFAULT 0,
        meta_title VARCHAR(255),
        meta_description TEXT,
        published_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Blogs table ready');

    // Create email templates table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        subject VARCHAR(255) NOT NULL,
        body LONGTEXT NOT NULL,
        variables JSON,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Email templates table ready');

    // Create email logs table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        template_id INT,
        to_email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        body LONGTEXT,
        status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
        error_message TEXT,
        sent_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Email logs table ready');

    // Create activity logs table for admin audit trail
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id INT,
        old_values JSON,
        new_values JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Activity logs table ready');

    // Create settings table
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
        category VARCHAR(50) DEFAULT 'general',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Settings table ready');

    // Create indexes
    const indexes = [
      { table: 'users', index: 'idx_users_email', column: 'email' },
      { table: 'users', index: 'idx_users_role', column: 'role' },
      { table: 'users', index: 'idx_users_status', column: 'status' },
      { table: 'transactions', index: 'idx_transactions_user', column: 'user_id' },
      { table: 'transactions', index: 'idx_transactions_status', column: 'status' },
      { table: 'support_tickets', index: 'idx_tickets_status', column: 'status' },
      { table: 'support_tickets', index: 'idx_tickets_user', column: 'user_id' },
      { table: 'blogs', index: 'idx_blogs_status', column: 'status' },
      { table: 'blogs', index: 'idx_blogs_slug', column: 'slug' },
      { table: 'resumes', index: 'idx_resumes_user', column: 'user_id' },
    ];

    for (const idx of indexes) {
      try {
        await initConnection.query(`CREATE INDEX ${idx.index} ON ${idx.table}(${idx.column})`);
      } catch (e) {
        // Index might already exist, ignore
      }
    }
    console.log('✅ Indexes created');

    // Insert default pricing plans if not exist
    await initConnection.query(`
      INSERT IGNORE INTO pricing_plans (name, slug, price, billing_type, features, is_popular) VALUES
      ('Free', 'free', 0, 'one-time', '["3 Basic templates", "1 Resume download", "PDF export", "Basic formatting", "Email support"]', FALSE),
      ('Pro', 'pro', 199, 'one-time', '["All 10+ templates", "Unlimited downloads", "PDF export", "AI content rephrasing", "No watermark", "Priority support", "Custom colors & fonts", "Cover letter builder"]', TRUE),
      ('Enterprise', 'enterprise', 999, 'yearly', '["Everything in Pro", "Up to 50 team members", "Team management", "Analytics dashboard", "Custom branding", "API access", "Dedicated support", "Training sessions"]', FALSE)
    `);
    console.log('✅ Default pricing plans inserted');

    // Insert default email templates if not exist
    await initConnection.query(`
      INSERT IGNORE INTO email_templates (name, slug, subject, body, variables) VALUES
      ('Welcome Email', 'welcome', 'Welcome to ResumeBuilder!', '<h1>Welcome {{name}}!</h1><p>Thank you for joining ResumeBuilder. Start creating your professional resume today.</p>', '["name", "email"]'),
      ('Payment Confirmation', 'payment_confirmation', 'Payment Received - ResumeBuilder', '<h1>Payment Confirmed</h1><p>Hi {{name}},</p><p>We have received your payment of {{amount}} for {{plan_name}}.</p><p>Invoice: {{invoice_number}}</p>', '["name", "amount", "plan_name", "invoice_number"]'),
      ('Password Reset', 'password_reset', 'Reset Your Password - ResumeBuilder', '<h1>Password Reset Request</h1><p>Hi {{name}},</p><p>Click the link below to reset your password:</p><a href="{{reset_link}}">Reset Password</a>', '["name", "reset_link"]'),
      ('Support Ticket Created', 'ticket_created', 'Support Ticket #{{ticket_number}} Created', '<h1>Support Ticket Created</h1><p>Hi {{name}},</p><p>Your support ticket #{{ticket_number}} has been created. Our team will respond shortly.</p>', '["name", "ticket_number", "subject"]'),
      ('Support Ticket Reply', 'ticket_reply', 'New Reply on Ticket #{{ticket_number}}', '<h1>New Reply</h1><p>Hi {{name}},</p><p>There is a new reply on your support ticket #{{ticket_number}}.</p><p>{{message}}</p>', '["name", "ticket_number", "message"]')
    `);
    console.log('✅ Default email templates inserted');

    // Insert default templates if not exist
    await initConnection.query(`
      INSERT IGNORE INTO templates (template_id, name, description, category, is_premium, is_active) VALUES
      ('ats', 'ATS Friendly', 'Simple, clean layout optimized for applicant tracking systems', 'ats', FALSE, TRUE),
      ('classic', 'Classic', 'Traditional resume format with a timeless design', 'professional', FALSE, TRUE),
      ('modern', 'Modern', 'Contemporary design with a fresh, clean look', 'modern', FALSE, TRUE),
      ('minimal', 'Minimal', 'Clean and simple design focusing on content', 'ats', FALSE, TRUE),
      ('professional', 'Professional', 'Polished look perfect for corporate environments', 'professional', FALSE, TRUE),
      ('creative', 'Creative', 'Unique design for creative professionals', 'creative', TRUE, TRUE),
      ('executive', 'Executive', 'Sophisticated design for senior professionals', 'professional', TRUE, TRUE),
      ('tech', 'Tech', 'Modern design tailored for tech industry', 'modern', TRUE, TRUE),
      ('elegant', 'Elegant', 'Refined design with subtle styling', 'creative', TRUE, TRUE),
      ('bold', 'Bold', 'Eye-catching design that makes a statement', 'creative', TRUE, TRUE)
    `);
    console.log('✅ Default templates inserted');

    // Insert default admin user if not exist (password: admin123)
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 10);
    await initConnection.query(`
      INSERT IGNORE INTO users (name, email, password, role, status) VALUES
      ('Super Admin', 'admin@resumebuilder.com', ?, 'superadmin', 'active')
    `, [adminPassword]);
    console.log('✅ Default admin user created (email: admin@resumebuilder.com, password: admin123)');

    await initConnection.end();

    // Now create the connection pool with the database
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    return pool;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('\n📋 Make sure MySQL is running (XAMPP/WAMP/MySQL Service)');
    process.exit(1);
  }
};

// Test database connection
const testConnection = async () => {
  try {
    await initializeDatabase();
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Get pool (for use in controllers)
const getPool = () => pool;

module.exports = { getPool, testConnection };
