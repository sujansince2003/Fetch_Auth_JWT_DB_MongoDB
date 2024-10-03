---

# Project Authentication with JWT and MongoDB

This project implements user authentication using JSON Web Tokens (JWT) and MongoDB. Below are the explanations for the core files responsible for database connection and server setup.

## Table of Contents

- [db.js](#dbjs)

- [app.js](#appjs)

- [Setup Instructions](#setup-instructions)

## db.js

The `db.js` file is responsible for connecting to the MongoDB database using Mongoose. It handles the connection logic and exports a function that can be called to establish a connection.

### Code Explanation

```javascript

const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({

  path: ".env",

});

async function connectDB() {

  if (mongoose.connection.readyState === 1) {

    console.log("database is connected already");

    return;

  }

  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database connected Successfully");

  } catch (error) {

    console.log("Error connecting to database");

  }

}

module.exports = connectDB;

```

### Components

- **Mongoose**: A MongoDB object modeling tool that provides a schema-based solution to model application data.

- **dotenv**: A zero-dependency module that loads environment variables from a `.env` file into `process.env`.

### Key Functions

- **`connectDB()`**: This asynchronous function checks if a connection to the database is already established. If not, it attempts to connect using the connection URI stored in the `.env` file.

- **Logging**: The function logs the status of the connection to the console.

### Environment Variables

- **`MONGO_URI`**: This variable contains the URI string required to connect to the MongoDB database. Ensure that this variable is set correctly in your `.env` file.

## app.js

The `app.js` file is the main entry point for the application. It sets up the Express server, connects to the database, and defines routes for user registration, login, and protected resources.

### Code Explanation

```javascript

const express = require("express");

const mongoose = require("mongoose");

const dotenv = require("dotenv");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const connectDB = require("./db");

dotenv.config({

  path: ".env",

});

// Setting up the database connection

async function startServer() {

  try {

    await connectDB();

    console.log("Database connected Successfully");

    // Setting up the Express server

    app.listen(3000, () => {

      console.log("server running:::::3000");

    });

  } catch (error) {

    console.log("Database connection failed", error);

  }

}

startServer();

// User Schema Definition

const userSchema = new mongoose.Schema({

  username: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  refreshToken: { type: String }, // To store refresh token

}, { timestamps: true });

// User Model

const authUsers = mongoose.model("authusers", userSchema);

// Setting up Express

const app = express();

app.use(express.json());

// Register Route

app.post("/register", async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {

    return res.status(401).json({ status: 401, message: "Username or password is required" });

  }

  const existingUser = await authUsers.findOne({ username });

  if (existingUser) {

    return res.status(400).json({ status: 400, message: "User already exists" });

  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new authUsers({ username, password: hashedPassword });

  await newUser.save();

  res.status(201).json({ message: "User Registered Successfully" });

});

// Login Route

app.post("/login", async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {

    return res.status(401).json({ status: 401, message: "Username or password is required" });

  }

  const user = await authUsers.findOne({ username });

  if (!user) {

    return res.status(404).json({ status: 404, message: "User does not exist. Please register" });

  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {

    return res.status(401).json({ status: 401, message: "Password unmatched" });

  }

  const accessToken = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });

  const refreshToken = jwt.sign({ username: user.username, id: user.id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '7d' });

  user.refreshToken = refreshToken;

  await user.save();

  res.status(200).json({ status: 200, message: "User logged in successfully", accessToken, refreshToken });

});

// Middleware for token verification

function verifyToken(req, res, next) {

  const clientToken = req.headers.authorization;

  if (!clientToken) {

    return res.status(401).json({ status: 401, message: "Token is not received" });

  }

  try {

    const decodedData = jwt.verify(clientToken.split(" ")[1], process.env.JWT_SECRET_KEY);

    req.jwtdecodedData = decodedData;

    next();

  } catch (error) {

    res.status(403).json({ message: "Invalid or expired token" });

  }

}

// Protected Route

app.get("/getusers", verifyToken, async (req, res) => {

  const users = await authUsers.find({});

  res.status(200).json({ status: 200, message: `Hello ${req.jwtdecodedData.username}`, users });

});

```

### Components

- **Express**: A web application framework for Node.js, designed for building web applications and APIs.

- **Mongoose**: Used for object modeling and data interaction with MongoDB.

- **bcrypt**: A library for hashing passwords to enhance security.

- **jsonwebtoken**: A library for creating and verifying JSON Web Tokens.

### Key Functions

- **`startServer()`**: Connects to the MongoDB database and starts the Express server on port 3000.

- **User Schema and Model**: Defines the structure for user data in the database.

- **Routes**: 

  - `/register`: For user registration, hashes passwords and stores user data.

  - `/login`: Validates user credentials, generates and returns access and refresh tokens.

  - `/getusers`: A protected route that retrieves all users after verifying the access token.

### Environment Variables

- **`MONGO_URI`**: Connection string for the MongoDB database.

- **`JWT_SECRET_KEY`**: Secret key for signing JWTs.

- **`JWT_REFRESH_SECRET_KEY`**: Secret key for signing refresh tokens.

## Setup Instructions

1\. **Clone the Repository**

   ```bash

   git clone <repository-url>

   cd <repository-directory>

   ```

2\. **Install Dependencies**

   ```bash

   npm install

   ```

3\. **Create a `.env` File**

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext

   MONGO_URI=<your-mongodb-uri>

   JWT_SECRET_KEY=<your-jwt-secret>

   JWT_REFRESH_SECRET_KEY=<your-jwt-refresh-secret>

   ```

4\. **Run the Application**

   ```bash

   node app.js

   ```

   The server should start running on `http://localhost:3000`.

5\. **Test the Endpoints**

   Use a tool like Postman or cURL to test the `/register`, `/login`, and `/getusers` endpoints.

---
