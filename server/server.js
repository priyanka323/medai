// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const medicineRoutes = require('./routes/medicineRoutes');
// const doseRoutes = require('./routes/doseRoutes');
// const chatRoutes = require('./routes/chatRoutes');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medidose', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('MongoDB connected successfully to medidose database');
//   console.log('Database name:', mongoose.connection.name);
//   console.log('Collections:', Object.keys(mongoose.connection.collections));
// })
// .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/medicines', medicineRoutes);
// app.use('/api/dose', doseRoutes);
// app.use('/api/chat', chatRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Server is running', database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
// });

// // Check database connection
// app.get('/api/db-check', async (req, res) => {
//   try {
//     const count = await mongoose.connection.db.collection('medicines').countDocuments();
//     res.json({ status: 'OK', message: 'Database connected', medicineCount: count });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Allowed origins: https://medidoseai.netlify.app`);
// });
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

// ✅ CORS Configuration - Allow your Netlify frontend
const allowedOrigins = [
  'https://medidoseai.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Blocked origin:', origin);
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medidose', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully to medidose database');
  console.log('📊 Database name:', mongoose.connection.name);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.log('⚠️ Running without database - using fallback data');
});

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/dose', doseRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    allowedOrigins: allowedOrigins
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MediDose API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      medicines: '/api/medicines',
      dose: '/api/dose/calculate',
      chat: '/api/chat/message'
    }
  });
});

// Check database connection
app.get('/api/db-check', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const medicineCount = await mongoose.connection.db.collection('medicines').countDocuments();
      res.json({ 
        status: 'OK', 
        message: 'Database connected', 
        medicineCount,
        collections: collections.map(c => c.name)
      });
    } else {
      res.json({ status: 'Disconnected', message: 'Database not connected' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    availableEndpoints: ['/', '/api/health', '/api/medicines', '/api/dose/calculate', '/api/chat/message', '/api/db-check']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`🔗 Allowed origins: ${allowedOrigins.join(', ')}`);
});