require('dotenv').config();

const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.PG_HOST, // Replace with your Supabase host
  port: process.env.PG_PORT,                         // Default PostgreSQL port
  database: process.env.PG_DATABASE,               // Replace with your database name
  user: process.env.PG_USER,         // Replace with your username
  password: process.env.PG_PASSWORD, // Replace with your password
  ssl: {

    rejectUnauthorized: false,
    mode: 'prefer',         // Disable strict SSL certificate checks
  }, // Ensure SSL is enabled
});

// Export the pool to use in other files
module.exports = pool;
