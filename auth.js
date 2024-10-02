const express = require("express");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const app = express();
app.use(express.json());

// setting up jwt
const JWT_SECRET_KEY = "abc1234567890";
const users = [];

// defining register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      status: 400,
      message: "Bad Request: 'username' and 'password' are required.",
    });
  }

  //hashing the password
  const hashedPassword = await bycrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({
    message: "User Registered Successfully",
    users,
  });
});

//login route

app.post("/post", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(404).send("username is not found");
  }
  res.status(200).send(username);
});

app.listen(3000, () => {
  console.log("hello this is running");
});
