const mongoose = require('mongoose');
const logger = require('../src/config/logger');
const validateEnv = require('../src/config/env');
const connectDB = require('../src/config/db');

// Mock process.exit to prevent the test from exiting
jest.spyOn(process, 'exit').mockImplementation(() => {});

// Test environment validation
function testEnvValidation() {
  console.log('Running environment validation test...');
  try {
    const env = validateEnv();
    console.log('Environment validation passed:', env);
  } catch (error) {
    console.error('Environment validation failed:', error.message);
  }
}

// Test database connection
async function testDBConnection() {
  console.log('Running database connection test...');
  try {
    await connectDB();
    console.log('Database connection test passed');
  } catch (error) {
    console.error('Database connection test failed:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

// Test logger functionality
function testLogger() {
  console.log('Running logger test...');
  logger.info('This is an info log for testing');
  logger.error('This is an error log for testing');
  console.log('Logger test completed');
}

// Run all tests
console.log('Running all config tests...');
testEnvValidation();
testDBConnection();
testLogger(); 