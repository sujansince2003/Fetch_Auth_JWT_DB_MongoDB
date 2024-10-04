const { Admin } = require("../db/db");

async function adminMiddleware(req, res, next) {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res.send("username or password is required");
  }

  try {
    const isUserExist = await Admin.findOne({
      username: username,
      password: password,
    });
    if (!isUserExist) {
      return res.status(403).json({
        message: "user doesnot exist",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      errormsg: error.message,
    });
  }
}

module.exports = adminMiddleware;
