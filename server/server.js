const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const medicineRoutes = require('./routes/medicineRoutes');
const doseRoutes = require('./routes/doseRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medidose', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully to medidose database');
  console.log('Database name:', mongoose.connection.name);
  console.log('Collections:', Object.keys(mongoose.connection.collections));
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/dose', doseRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

// Check database connection
app.get('/api/db-check', async (req, res) => {
  try {
    const count = await mongoose.connection.db.collection('medicines').countDocuments();
    res.json({ status: 'OK', message: 'Database connected', medicineCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: https://medidoseai.netlify.app`);
});