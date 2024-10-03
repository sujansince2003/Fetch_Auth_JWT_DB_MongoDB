const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");
dotenv.config({
  path: ".env",
});
// setting up database
async function startServer() {
  try {
    await connectDB();
    console.log("Database connected Successfully");
    // setting up port
    app.listen(3000, () => {
      console.log("server running:::::3000");
    });
  } catch (error) {
    console.log("Database connection failed", error);
  }
}
startServer();
//defining schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
// defining model
const authUsers = mongoose.model("authusers", userSchema);

// setting up expressjs
const app = express();
app.use(express.json());

// setting up register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({
      status: 401,
      message: "Username or password is required",
    });
  }
  const existingUser = await authUsers.findOne({ username: username });
  if (existingUser) {
    return res.status(400).json({
      status: 400,
      message: "User already exists",
      existingUser,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const authusers = new authUsers({
    username: username,
    password: hashedPassword,
  });
  await authusers.save();
  res.status(201).json({
    message: "User Registered Successfully",
  });
});

//login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).send("username or password is required");
  }
  const user = await authUsers.findOne({ username: username });
  if (!user) {
    return res.status(404).json({
      status: 400,
      message: "user dont exist:please register",
    });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({
      status: 401,
      message: "invalid username or password",
    });
  }

  const token = jwt.sign(
    {
      username: user.username,
      id: user.id,
    },
    process.env.JWT_SECRET_KEY
  );

  res.status(200).json({
    status: 200,
    message: "user logged in Successfully and token generated",
    token,
  });
});

// middleware to verify token
function verifytoken(req, res, next) {
  const clientToken = req.headers.authorization;
  if (!clientToken) {
    res.status(401).send("token is not received");
  }
  try {
    const dispatchedData = jwt.verify(
      clientToken.split(" ")[1],
      process.env.JWT_SECRET_KEY
    );
    req.jwtdecodedData = dispatchedData;
    next();
  } catch (error) {
    res.send("Invalid JWT TOKEN");
  }
}

// protected route

app.get("/getusers", verifytoken, async (req, res) => {
  const users = await authUsers.find({});
  if (!users) {
    res.status(404).send("users not found");
  }
  res.status(200).json({
    status: 200,
    message: `hello ${req.jwtdecodedData.username}`,
    users,
  });
});
