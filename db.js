const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432, // Default port for PostgreSQL
  ssl: {
    rejectUnauthorized: false // Required for Azure database connection
  }
});

module.exports = pool;
