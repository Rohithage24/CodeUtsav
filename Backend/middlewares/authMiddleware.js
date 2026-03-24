// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";
import AuthUser from "../models/auth.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Try cookie first, then Authorization header (Bearer token)
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Session expired. Please login again."
          : "Invalid token. Please login again.";
      return res.status(401).json({ success: false, message });
    }

    // Find user in DB
    const user = await AuthUser.findById(decoded.id).select("-otp -otpExpiry");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("authMiddleware error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default authMiddleware;
