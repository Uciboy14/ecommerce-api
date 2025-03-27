# E-commerce API

A robust and scalable e-commerce API built with Node.js, Express, and MongoDB.

## Features

- User Authentication & Authorization
- Product Management
- Shopping Cart
- Order Processing
- Payment Integration (Stripe)
- Email Notifications
- Rate Limiting
- API Documentation (Swagger)
- Redis Caching
- Error Handling
- Request Validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- Stripe Account (for payments)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and configure your environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

Once the server is running, you can access the API documentation at:
```
http://localhost:3000/api-docs
```

## Project Structure

```
ecommerce-api/
│── src/
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── middlewares/        # Custom middleware
│   ├── models/             # Database models
│   ├── repositories/       # Database operations
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── app.js              # Express app
│   └── server.js           # Server entry point
│── tests/                  # Test files
│── public/                 # Static files
```

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot-reload
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
