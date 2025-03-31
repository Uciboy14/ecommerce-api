// Import required dependencies
const { cleanEnv, str, port, url, num } = require('envalid');
const logger = require('./logger');

/**
 * Environment Variable Validation Configuration
 * This function validates all required environment variables
 * and provides type checking and default values where appropriate
 * 
 * @returns {Object} - Validated environment variables
 * @throws {Error} - If validation fails
 */
const validateEnv = () => {
  try {
    const env = cleanEnv(process.env, {
      // Server Configuration
      NODE_ENV: str({
        choices: ['development', 'test', 'production'],
        default: 'development'
      }),
      PORT: port({ default: 3000 }),

      // MongoDB Configuration
      MONGODB_URI: url({
        desc: 'MongoDB connection string',
        example: 'mongodb://localhost:27017/ecommerce'
      }),

      // JWT Configuration
      JWT_SECRET: str({
        desc: 'Secret key for JWT signing',
        example: 'your-secret-key'
      }),
      JWT_EXPIRES_IN: str({
        desc: 'JWT expiration time',
        default: '24h'
      }),

      // Redis Configuration (if using Redis)
      REDIS_HOST: str({
        desc: 'Redis host',
        default: 'localhost'
      }),
      REDIS_PORT: port({
        desc: 'Redis port',
        default: 6379
      }),

      // Email Configuration
      SMTP_HOST: str({
        desc: 'SMTP server host',
        example: 'smtp.gmail.com'
      }),
      SMTP_PORT: port({
        desc: 'SMTP server port',
        default: 587
      }),
      SMTP_USER: str({
        desc: 'SMTP username/email'
      }),
      SMTP_PASS: str({
        desc: 'SMTP password'
      }),

      // Payment Configuration (Stripe)
      STRIPE_SECRET_KEY: str({
        desc: 'Stripe secret key'
      }),
      STRIPE_WEBHOOK_SECRET: str({
        desc: 'Stripe webhook secret'
      }),

      // Rate Limiting
      RATE_LIMIT_WINDOW_MS: num({
        desc: 'Rate limiting window in milliseconds',
        default: 900000 // 15 minutes
      }),
      RATE_LIMIT_MAX_REQUESTS: num({
        desc: 'Maximum requests per window',
        default: 100
      })
    });

    // Log successful validation
    logger.info('Environment variables validated successfully');

    return env;
  } catch (error) {
    // Log validation error and exit process
    logger.error(`Environment validation error: ${error.message}`);
    process.exit(1);
  }
};

// Export the validation function
module.exports = validateEnv;
