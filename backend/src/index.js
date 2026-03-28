require('dotenv').config();
const express = require('express');
const cors = require('cors');

const newsRoutes = require('./routes/newsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'newsmind-backend' });
});

app.use('/api', newsRoutes);

app.get('/', (req, res) => {
  res.send('NewsMind Backend Running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
