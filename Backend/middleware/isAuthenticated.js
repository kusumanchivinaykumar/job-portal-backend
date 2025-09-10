import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.token ||
      (req.headers["authorization"] ? req.headers["authorization"].split(" ")[1] : null);

    if (!token) {
      return res.status(401).json({ message: "No token provided", success: false });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request
    req.id = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default authenticateToken;
