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

    // Create users table if it doesn't exist
    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Users table ready');

    // Create index if not exists (ignore error if already exists)
    try {
      await initConnection.query('CREATE INDEX idx_users_email ON users(email)');
    } catch (e) {
      // Index might already exist, ignore
    }

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
