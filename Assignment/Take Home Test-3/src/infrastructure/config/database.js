const mongoose = require('mongoose');
const logger = require('../logging/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.info('MongoDB disconnected');
});

module.exports = connectDB;
