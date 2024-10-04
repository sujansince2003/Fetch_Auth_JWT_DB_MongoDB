const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: ".env",
});

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected::");
  } catch (error) {
    console.log("something went wrong while connecting to database");
    throw error;
  }
}
// defining schemas

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  purchasedcourse: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

// defining model
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

// exporting the modules
module.exports = {
  connectDB,
  User,
  Admin,
  Course,
};
