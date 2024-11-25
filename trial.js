// const express = require('express');
// const supabase = require('./supabase_client'); // Import the Supabase client
// const { Query } = require('pg');

// const app = express();
// const PORT = 3000;

// // Example GET endpoint to fetch all rows from the "documents" table
// app.get('/', async (req, res) => {
//   try {
//     const query = `
//     SELECT *
//     FROM roles
//     WHERE role_name= 'HR';
//     `;
//     // Query the "documents" table
//     const { data, error } = await supabase.rpc("fetch-_hr_roles");


//     if (error) {
//       console.error('Error fetching data:', error);
//       return res.status(500).json({ error: 'Failed to fetch documents.' });
//     }

//     // Send the retrieved data as a response
//     res.status(200).json(data);
//   } catch (err) {
//     console.error('Server error:', err);
//     res.status(500).json({ error: 'An unexpected error occurred.' });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const pool = require('./src/config/db'); // Import the PostgreSQL pool

const app = express();
const PORT = 3000;

require('dotenv').config();

// Example GET endpoint to fetch roles where role_name = 'hr'
app.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM roles
      WHERE role_name = $1
      `,['HR']); // Use parameterized queries to avoid SQL injection

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database query failed.' });
  }0
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
