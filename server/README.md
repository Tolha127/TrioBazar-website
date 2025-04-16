# Server Side - TrioBazar Website

This directory contains the server-side code for the TrioBazar website. The server is responsible for handling API requests, managing the database, and serving data to the client-side application.

## Features
- RESTful API endpoints for data management.
- User authentication and authorization.
- Database integration for storing and retrieving data.
- Error handling and logging.

## Technologies Used
- **Node.js**: Runtime environment.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: Database for storing application data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: For secure user authentication.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/TrioBazar-website.git
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
    ```

4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

| Method | Endpoint       | Description              |
|--------|----------------|--------------------------|
| GET    | /api/products  | Fetch all products       |
| POST   | /api/products  | Add a new product        |
| GET    | /api/users     | Fetch all users          |
| POST   | /api/auth/login| User login               |

## Folder Structure

```
server/
├── controllers/   # Business logic
├── models/        # Database schemas
├── routes/        # API routes
├── middleware/    # Custom middleware
├── config/        # Configuration files
└── app.js         # Main application file
```

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.