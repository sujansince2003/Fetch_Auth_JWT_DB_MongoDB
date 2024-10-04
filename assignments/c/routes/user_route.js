const express = require("express");
const userMiddleware = require("../middlewares/user_middleware");
const { User, Course } = require("../db/db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// user login route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(403).json({
      message: "username or password is required",
    });
  }
  const userExist = await User.findOne({ username: username });
  if (userExist) {
    return res.send(403).json({
      message: "user already exist",
    });
  }
  const user = await User.create({
    username: username,
    password: password,
  });
  await user.save();
  return res.status(200).json({
    message: "user created successfully",
  });
});

// get list of  courses

router.get("/getcourses", userMiddleware, async (req, res) => {
  const courses = await Course.find({});
  if (!courses) {
    return res.status(400).json({
      message: "courses not found",
    });
  }
  res.status(200).json({
    courses,
  });
});

//purchase courses
router.get("/purchase/:id", userMiddleware, async (req, res) => {
  const courseId = req.params.id;
  const { username } = req.headers;
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }
  try {
    const user = await User.findOne({ username: username });
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        message: "course doesnot exist",
      });
    }
    user.purchasedcourse.push(course._id);
    await user.save();
    return res.status(200).json({
      message: "purchased course successfully",
      purchasedcourse: course.title,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occured",
      errmsg: error.message,
    });
  }
});
//get purchased course
router.get("/purchasedcourse", userMiddleware, async (req, res) => {
  const { username } = req.headers;
  const user = await User.findOne({ username: username }).populate(
    "purchasedcourse"
  );
  if (!user) {
    return res.status(400).send("user doesnot exists");
  }
  const purchasedcourses = user.purchasedcourse;

  return res.status(200).json({
    purchasedcourses,
    userdetails: user,
  });
});
//export router
module.exports = router;
