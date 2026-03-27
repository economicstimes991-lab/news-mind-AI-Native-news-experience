require('dotenv').config();
const express = require('express');
const cors = require('cors');

const newsRoutes = require('./routes/newsRoutes');
app.use('/api', newsRoutes);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'newsmind-backend' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});