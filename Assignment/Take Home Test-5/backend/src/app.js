const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./infrastructure/logging/logger');

const app = express();

// Security and middleware
app.use(helmet());

// Strict CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', globalLimiter);

// Morgan request logging mapped to Winston
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// Import Routes
const authRoutes = require('./presentation/routes/authRoutes');
const bookRoutes = require('./presentation/routes/bookRoutes');
const userRoutes = require('./presentation/routes/userRoutes');
const transactionRoutes = require('./presentation/routes/transactionRoutes');
const reportRoutes = require('./presentation/routes/reportRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

// Frontend logs endpoint
app.post('/api/logs', (req, res) => {
  const { message, stack, errorInfo } = req.body;
  logger.error(`Frontend Error: ${message}`, { stack, errorInfo });
  res.status(200).json({ success: true });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Library API is running' });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
