const express = require("express");
const adminMiddleware = require("../middlewares/admin_middleware");
const { Admin, Course } = require("../db/db");

const router = express.Router();

// admin login route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const userexist = await Admin.findOne({ username: username });
  if (userexist) {
    return res.status(403).json({
      status: 403,
      message: "User already exist",
    });
  }
  const adminuser = await Admin.create({
    username: username,
    password: password,
  });
  await adminuser.save();
  return res.status(200).json({
    status: 200,
    message: "User created successfully",
  });
});

// create course

router.post("/createcourse", adminMiddleware, async (req, res) => {
  const { title, price, description } = req.body;
  const { username } = req.headers;
  if (!title || !price || !description) {
    return res.status(403).json({
      status: 403,
      message: "Title or price or description is missing",
    });
  }

  try {
    const courseExist = await Course.findOne({ title: title });
    if (courseExist) {
      return res.status(403).json({
        status: 403,
        message: "Course with same title already exists",
      });
    }
    const newCourse = await Course.create({
      title: title,
      price: price,
      description: description,
    });

    // adding createdCourse field
    const adminUser = await Admin.findOne({ username: username });
    if (adminUser) {
      adminUser.createdCourses.push(newCourse._id);
      await adminUser.save();
      newCourse.createdBy = adminUser._id;

      await newCourse.save();
    }

    return res.status(200).json({
      status: 200,
      message: "course created successfully",
      newCourse,
    });
  } catch (error) {
    return res.status(403).json({
      status: 403,
      message: "Error creating course",
      errorMsg: error.message,
    });
  }
});

//view courses
router.get("/courses", adminMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({});
    if (!courses) {
      res.status(403).json({
        message: "Courses not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error occured",
    });
  }
});

//export router
module.exports = router;
