const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./db");
dotenv.config({
  path: ".env",
});

//setting up express
const app = express();

async function startServer() {
  try {
    connectDB();
    app.listen(3000, () => {
      console.log("server started with database");
    });
  } catch (error) {
    console.log("something went wrong while starting server", error.message);
  }
}
startServer();
