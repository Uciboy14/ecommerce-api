// Import required dependencies
const mongoose = require('mongoose');
const logger = require('./logger');

/**
 * Main database connection function
 * Establishes connection to MongoDB with proper error handling
 * Uses environment variables for configuration
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    // useNewUrlParser: Use the new URL string parser
    // useUnifiedTopology: Use the new Server Discovery and Monitoring engine
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Optional: Add connection pooling settings
      maxPoolSize: 10,
      // Optional: Add connection timeout
      serverSelectionTimeoutMS: 5000,
      // Optional: Add socket timeout
      socketTimeoutMS: 45000,
    });

    // Log successful connection
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log connection error and exit process
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * MongoDB Connection Event Handlers
 * These listeners handle various database connection events
 */

// Handle connection errors after initial connection
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
});

// Handle disconnection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// Handle successful reconnection
mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

// Handle initial connection
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully');
});

/**
 * Graceful Shutdown Handler
 * Ensures proper database connection closure when the application terminates
 */
process.on('SIGINT', async () => {
  try {
    // Close the MongoDB connection
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    logger.error(`Error during MongoDB connection closure: ${err}`);
    process.exit(1);
  }
});

// Export the connection function
module.exports = connectDB;
