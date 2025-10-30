// adminMiddleware.js
const jwt = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).json({ message: "You are not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.userId = decoded.id;
    next();

  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = { adminMiddleware };
