const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://my-fullstack-website.vercel.app', 'https://my-fullstack-website-git-master-kyrhyl.vercel.app', 'http://localhost:3000']
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https:", "http:"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files from uploads directory
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));

// Health check endpoint with database connection status
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    let dbStatus = 'unknown';
    let dbConnected = false;
    
    switch(dbState) {
      case 0: // disconnected
        dbStatus = 'disconnected';
        break;
      case 1: // connected
        dbStatus = 'connected';
        dbConnected = true;
        break;
      case 2: // connecting
        dbStatus = 'connecting';
        break;
      case 3: // disconnecting
        dbStatus = 'disconnecting';
        break;
    }
    
    // Get some basic stats
    let stats = {};
    if (dbConnected) {
      try {
        const User = require('./models/User');
        const Product = require('./models/Product');
        
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        
        stats = {
          users: userCount,
          products: productCount,
          database: dbStatus,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        stats = {
          error: 'Failed to get stats',
          database: dbStatus,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    res.json({
      message: 'E-commerce API is running!',
      status: 'healthy',
      database: {
        status: dbStatus,
        connected: dbConnected,
        host: mongoose.connection.host || 'unknown'
      },
      stats: stats,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Health check failed',
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Debug endpoint for Vercel troubleshooting
app.get('/api/debug', async (req, res) => {
  try {
    const debugInfo = {
      environment: process.env.NODE_ENV || 'development',
      mongodb_uri_set: !!process.env.MONGODB_URI,
      jwt_secret_set: !!process.env.JWT_SECRET,
      database_state: mongoose.connection.readyState,
      database_host: mongoose.connection.host,
      database_name: mongoose.connection.name,
      timestamp: new Date().toISOString()
    };

    // Test database operations
    if (mongoose.connection.readyState === 1) {
      try {
        const User = require('./models/User');
        const Product = require('./models/Product');
        
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        
        debugInfo.database_operations = {
          users_count: userCount,
          products_count: productCount,
          status: 'success'
        };
      } catch (dbError) {
        debugInfo.database_operations = {
          error: dbError.message,
          status: 'failed'
        };
      }
    }

    res.json(debugInfo);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running!' });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5001;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer(); 