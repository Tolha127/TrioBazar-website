# Server Side - TrioBazar Website

This directory contains the server-side code for the TrioBazar website. The server is responsible for handling API requests, managing the database, and serving data to the client-side application.

## Features
- RESTful API endpoints for data management.
- User authentication and authorization.
- Database integration for storing and retrieving data.
- Error handling and logging.

## Technologies Used
- **Node.js**: Runtime environment
- **Express.js**: Web framework for building APIs
- **MongoDB**: Database for storing application data
- **Mongoose**: ODM for MongoDB
- **JWT**: For secure user authentication
- **Cloudinary**: Cloud storage for product images
- **Multer/Sharp**: Image upload and processing
- **Joi**: Request validation
- **Helmet**: Security headers management
- **Compression**: Response compression
- **Redis**: Caching (optional)
- **Express Rate Limit**: API request limiting

## Installation

1. Clone the repository:
    ```bash
    git clone [private repository URL]
    cd TrioBazar-website/server
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following variables:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

| Method | Endpoint                | Description                      |
|--------|-------------------------|----------------------------------|
| GET    | /api/products           | Fetch all products               |
| POST   | /api/products           | Add a new product                |
| GET    | /api/products/:id       | Get a specific product           |
| PUT    | /api/products/:id       | Update a product                 |
| DELETE | /api/products/:id       | Delete a product                 |
| GET    | /api/testimonials       | Get all testimonials             |
| POST   | /api/testimonials       | Add a new testimonial            |
| POST   | /api/auth/login         | User login                       |
| POST   | /api/auth/register      | Register new user                |
| POST   | /api/auth/refresh-token | Refresh authentication token     |
| GET    | /api/messages           | Get all messages                 |
| POST   | /api/messages           | Send a new message               |
| GET    | /api/seo/sitemap.xml    | Generate sitemap                 |

## Folder Structure

```
server/
├── models/        # Database schemas (User, Product, Message, etc.)
├── routes/        # API routes (auth, products, testimonials, etc.)
├── middleware/    # Custom middleware (auth, error handling, security)
├── utils/         # Utility functions and helpers
├── logs/          # Log files
├── scripts/       # Admin scripts and data migration tools
├── tests/         # Test files
├── uploads/       # User uploaded files
├── validations/   # Request validation schemas
└── server.js      # Main application entry point
```

## License
This project is licensed under the MIT License. Private project - not open for contributions.