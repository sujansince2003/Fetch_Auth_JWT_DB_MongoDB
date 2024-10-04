const { User } = require("../db/db");

async function userMiddleware(req, res, next) {
  const { username, password } = req.headers;
  if (!username || !password) {
    return res.send("username or password is required");
  }

  const isUserExist = await User.findOne({
    username: username,
    password: password,
  });
  if (!isUserExist) {
    return res.status(403).json({
      message: "user doesnot exist",
    });
  }
  next();
}

module.exports = userMiddleware;
