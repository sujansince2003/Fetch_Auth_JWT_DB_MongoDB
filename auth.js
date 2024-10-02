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

//login route (for generating JWT)

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const passwordGivenByUser = password;
  if (!username || !password) {
    return res.status(400).json({
      message: "username or password is required",
    });
  }
  //   find the user in the database (using array here)
  const user = users.find((u) => u.username === username);
  //find() method returns the value of the first element that passes a test.
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "User not found",
    });
  }
  const isValidPassword = await bycrypt.compare(
    passwordGivenByUser,
    user.password
  );
  if (!isValidPassword)
    return res.status(401).json({
      status: 401,
      message: "Invalid password",
    });

  // generate JWT
  const token = jwt.sign(
    {
      username: user.username,
      tokenby: "sujancodes",
    },
    JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.status(200).json({
    status: 200,
    token,
    message: "JWT token generated",
  });
});

app.listen(3000, () => {
  console.log("hello this is running");
});
