# TrioBazar E-Commerce Platform

## 🚀 Overview
TrioBazar is a comprehensive e-commerce platform developed to provide customers with a seamless online shopping experience. The application features a React-based frontend client and a Node.js/Express backend server, connected to a MongoDB database for data persistence.

## 📋 Project Structure
The project is organized into two main components:

```
TrioBazar-website/
├── client/           # React frontend application
├── server/           # Node.js backend server
├── build-client.bat  # Script to build the client for production
├── start-server.bat  # Script to start the MongoDB and server
└── ...               # Other configuration files
```

## ✨ Features

### 🌐 Customer Features
- **Interactive Home Page** with featured products and promotional content
- **Product Catalog** with advanced browsing, filtering, and search capabilities
- **User Authentication** for account creation and secure login
- **User Testimonials** showcasing customer experiences
- **Contact System** for customer inquiries and support
- **About Us** section with company information and mission statement

### 👨‍💼 Admin Features
- **Secure Admin Dashboard** for site management
- **Product Management System** for adding, editing, and removing products
- **Order Management** for tracking and updating order statuses
- **User Management** for handling customer accounts
- **Testimonials Management** for reviewing and publishing customer reviews
- **Message Management** for responding to customer inquiries

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 18
- **Routing**: React Router DOM 6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **UI Components**: Custom components with React Icons
- **Styling**: CSS Modules and global styles

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Image Processing**: Multer, Sharp, and Cloudinary
- **API Validation**: Joi
- **Security**: Helmet, Express Rate Limit
- **Performance**: Compression, Caching

## 🚀 Getting Started

### Prerequisites
- Node.js 14.x or higher
- MongoDB Community Server
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/TrioBazar-website.git
   cd TrioBazar-website
   ```

2. Set up the client:
   ```bash
   cd client
   npm install
   cd ..
   ```

3. Set up the server:
   ```bash
   cd server
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/triobazar
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Running the Application

#### Using Batch Files (Windows)
1. Start the server and MongoDB:
   ```
   start-server.bat
   ```

2. In a separate terminal, build the client for production:
   ```
   build-client.bat
   ```

#### Manual Start
1. Start MongoDB server
2. Start the backend server:
   ```bash
   cd server
   npm start
   ```
3. In a separate terminal, start the frontend development server:
   ```bash
   cd client
   npm start
   ```
4. Access the application at `http://localhost:3000`

## 📁 Key Directories

- **client/src/components/**: React UI components
- **client/src/context/**: Context providers for state management
- **client/src/pages/**: Page components for each route
- **server/models/**: MongoDB data models
- **server/routes/**: API endpoint definitions
- **server/middleware/**: Custom Express middleware
- **server/utils/**: Utility functions

## 📄 License
This project is licensed under the MIT License. Private project 