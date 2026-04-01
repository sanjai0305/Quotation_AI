import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;

    /* =========================
       1. Extract token safely from Header
    ========================== */
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } 
    /* =========================
       2. Support query token (For PDF downloads)
    ========================== */
    else if (req.query.token) {
      token = req.query.token;
    }

    /* =========================
       3. Validate token existence
    ========================== */
    if (!token || token === "undefined" || token === "null") {
      console.warn("❌ Token missing or invalid format");
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing ❌",
      });
    }

    /* =========================
       4. Verify JWT
    ========================== */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* =========================
       5. Fetch user
    ========================== */
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.warn("❌ User not found for token ID:", decoded.id);
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found ❌",
      });
    }

    /* =========================
       6. Attach user to request
    ========================== */
    req.user = user;
    next();

  } catch (error) {
    console.error("🔥 Auth Middleware Crash:", error.message);
    
    // Give a clear message if token is expired vs invalid
    const message = error.name === "TokenExpiredError" 
      ? "Session expired, please login again ❌" 
      : "Invalid or malformed token ❌";

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export default protect;