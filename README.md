# irctc_seat_management_api

This is a RESTful API for a irctc_seat_management_api in trains, built with Node.js, Express.js, and MySQL. It supports user registration, login, train management, seat availability checks, seat booking, and booking details retrieval. The system uses a controllers layer for business logic, handles race conditions for bookings using MySQL transactions, and includes role-based access control.

## Assumptions
- The admin API key is set via the `ADMIN_API_KEY` environment variable.
- The JWT secret is set via the `JWT_SECRET` environment variable.
- MySQL is used with a database named `railway_db`.
- All endpoints return JSON responses.
- One seat is booked per request.

## Prerequisites
- Node.js
- MySQL
- Express
- bcryptjs
- jsonwebtoken
- dotenv

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
2. **Install Dependencies**
   ```bash
   mpm i dotenv express bcryptjs jsonwebtoken mysql2

2. **Set-up mysql database**
  Run the following SQL to create the required tables:
   ```bash
   CREATE DATABASE railway_db;
   USE railway_db;
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       role ENUM('user', 'admin') DEFAULT 'user'
   );

   CREATE TABLE trains (
       train_id INT AUTO_INCREMENT PRIMARY KEY,
       train_name VARCHAR(255) NOT NULL,
       source VARCHAR(255) NOT NULL,
       destination VARCHAR(255) NOT NULL,
       total_seats INT NOT NULL,
       available_seats INT NOT NULL
   );

   CREATE TABLE bookings (
       booking_id INT AUTO_INCREMENT PRIMARY KEY,
       user_id INT NOT NULL,
       train_id INT NOT NULL,
       booking_time DATETIME NOT NULL,
       FOREIGN KEY (user_id) REFERENCES users(id),
       FOREIGN KEY (train_id) REFERENCES trains(train_id)
   );


---

**Set up env variables**
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=railway_db
JWT_SECRET=your_jwt_secret
ADMIN_API_KEY=your_admin_api_key
PORT=3000

2. **API Endpoints**
   ```bash
   POST /api/auth/register - Register a new user
    Body: { "username": "string", "password": "string", "role": "user|admin" }
   POST /api/auth/login - Login and get JWT token
    Body: { "username": "string", "password": "string" }
   POST /api/trains/add - Add a new train (Admin only)
    Headers: x-api-key: <ADMIN_API_KEY>, Authorization: Bearer <JWT>
    Body: { "train_name": "string", "source": "string", "destination": "string", "total_seats": number }
   GET /api/trains/availability - Check seat availability
    Headers: Authorization: Bearer <JWT>
    Query: ?source=<string>&destination=<string>
   POST /api/bookings/book - Book a seat
    Headers: Authorization: Bearer <JWT>
    Body: { "train_id": number }
   GET /api/bookings/detail - Get booking details
    Headers: Authorization: Bearer <JWT>

**Testing**
 Postman json data is pushed along with code

  



