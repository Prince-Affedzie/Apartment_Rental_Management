// const jwt = require("jsonwebtoken");

// const verifyToken = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ message: "No token Provided" });
//     }
//     const decoded = jwt.verify(token, process.env.token);
//     req.user = decoded;
//     req.userId = decoded.id;
//     console.log("Authenticated[.js] user:", {
//       id: req.userId,
//       role: decoded.role,
//     });
//     next();
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { verifyToken };

const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    // ✅ Read token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    const decoded = jwt.verify(token, process.env.token);
    req.user = decoded;
    req.userId = decoded.id;

    console.log("Authenticated user:", {
      id: req.userId,
      role: decoded.role,
    });

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
