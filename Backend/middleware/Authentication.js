const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token Provided" });
    }
    const decoded = jwt.verify(token, process.env.token);
    req.user = decoded;
    req.userId = decoded.id;
    console.log("Authenticated[.js] user:", {
      id: req.userId,
      role: decoded.role,
    });
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { verifyToken };
