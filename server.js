const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
  res.send('Work Manager API Server');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
