import mysql, { PoolOptions } from 'mysql2/promise';

// Database configuration with proper typing
const dbConfig: PoolOptions = {
  host: process.env.DB_HOST || 'addons.clq6y60aosy2.ap-south-1.rds.amazonaws.com',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'addons',
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 60000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  idleTimeout: 300000
};

// Create connection pool for better performance
const pool = mysql.createPool(dbConfig);



export default pool;
