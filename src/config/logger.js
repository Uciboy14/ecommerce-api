// Import required dependencies
const winston = require('winston');
const path = require('path');

/**
 * Define the log format
 * - timestamp: Adds timestamp to each log entry
 * - errors: Includes stack traces for errors
 * - json: Formats logs as JSON for better parsing
 */
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Create the Winston logger instance
 * - level: Set based on environment (debug for development, info for production)
 * - format: Use the combined format defined above
 * - transports: Define where logs should be written
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // Console transport for immediate feedback
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      // Rotate error logs daily
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      // Rotate combined logs daily
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * Development-specific logging
 * Adds colored console output for better readability during development
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

/**
 * Create a stream object for Morgan integration
 * This allows Winston to work with Express's Morgan middleware
 */
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Export the configured logger
module.exports = logger;
