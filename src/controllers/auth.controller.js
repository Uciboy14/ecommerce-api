const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');

// Register a new user
/**
 * Registers a new user with a hashed password.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.register = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Hash the password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the hashed password
    const user = new User({ username, password: hashedPassword });

    // Save the user to the database
    await user.save();

    // Log the registration event
    logger.info(`User registered: ${username}`);

    // Send a success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Log the error
    logger.error('Error during registration:', error);

    // Handle any errors that occur during registration
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login a user
/**
 * Logs in a user and returns a JWT token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.login = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Find the user in the database by username
    const user = await User.findOne({ username });

    // If user is not found, send an unauthorized error
    if (!user) {
      logger.warn(`Login attempt failed for non-existent user: ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is invalid, send an unauthorized error
    if (!isPasswordValid) {
      logger.warn(`Invalid password attempt for user: ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with the user's ID as payload
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Log the successful login
    logger.info(`User logged in: ${username}`);

    // Send the token as a response
    res.json({ token });
  } catch (error) {
    // Log the error
    logger.error('Error during login:', error);

    // Handle any errors that occur during login
    res.status(500).json({ error: 'Internal server error' });
  }
}; 