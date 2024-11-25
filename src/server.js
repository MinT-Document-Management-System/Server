const express = require('express');
const pool = require('./config/db'); // Import the PostgreSQL pool

const app = express();
const PORT = 3000;

app.use(express.json());

require('dotenv').config();

// Example GET endpoint to fetch roles where role_name = 'hr'
// app.get('/', async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT *
//       FROM roles
//     `); // Use parameterized queries to avoid SQL injection

//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error('Database error:', err);
//     res.status(500).json({ error: 'Database query failed.' });
//   }0
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
