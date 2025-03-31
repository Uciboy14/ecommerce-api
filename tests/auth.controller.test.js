const request = require('supertest');
const express = require('express');
const authController = require('./auth.controller');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock the User model
jest.mock('../models/User');

// Mock the logger
jest.mock('../config/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

// Create an Express app for testing
const app = express();
app.use(express.json());
app.post('/register', authController.register);
app.post('/login', authController.login);

// Test suite for auth.controller.js

describe('Auth Controller', () => {
  describe('POST /register', () => {
    it('should register a new user', async () => {
      User.prototype.save = jest.fn().mockResolvedValueOnce({});

      const response = await request(app)
        .post('/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should return validation errors', async () => {
      const response = await request(app)
        .post('/register')
        .send({ username: '', password: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /login', () => {
    it('should login a user and return a token', async () => {
      const mockUser = { _id: 'userId', username: 'testuser', password: await bcrypt.hash('password123', 10) };
      User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
      jwt.sign = jest.fn().mockReturnValueOnce('fake-jwt-token');

      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe('fake-jwt-token');
    });

    it('should return an error for invalid credentials', async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/login')
        .send({ username: 'wronguser', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });
}); 