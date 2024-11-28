const express = require('express');
const Routes  = require('./routes/roleRoutes');// Import the PostgreSQL pool

const app = express();
const PORT = 3000;

app.use(express.json());

require('dotenv').config();

app.use('/api', Routes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

