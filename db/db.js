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
    console.log("Error connecting to database", error.message);
  }
}

module.exports = connectDB;
