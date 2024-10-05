const jwt = require("jsonwebtoken");

async function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.send("Token is not received");
  }

  try {
    const decodedData = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.adminData = decodedData;
    if (decodedData.role === "admin") {
      next();
    } else {
      res.status(403).json({
        message: "authorization failed:You are not authorized to access this",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      errormsg: error.message,
    });
  }
}

module.exports = adminMiddleware;
