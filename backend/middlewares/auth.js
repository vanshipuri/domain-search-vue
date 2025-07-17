// middlewares/auth.js

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // attach decoded user info to the request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
