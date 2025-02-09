const express = require('express');
const Routes  = require('./routes/mainRoutes');
const cors = require("cors")
const cookieParser = require('cookie-parser')

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());

require('dotenv').config();

app.use('/api', Routes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
