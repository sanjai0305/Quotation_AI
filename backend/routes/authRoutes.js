import express from "express";

import {
  // 🔐 AUTH
  registerUser,
  verifyOtp,
  loginUser,

  // 🔁 PASSWORD
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

// (Optional) Middleware
// import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==============================
// 🧪 HEALTH CHECK (optional)
// ==============================
router.get("/health", (req, res) => {
  res.json({ status: "Auth service running ✅" });
});


// ==============================
// 🔐 AUTH ROUTES
// ==============================

// 📝 Register + send OTP
router.post("/register", registerUser);

// 🔑 Verify OTP
router.post("/verify-otp", verifyOtp);

// 🔓 Login
router.post("/login", loginUser);


// ==============================
// 🔁 PASSWORD RESET ROUTES
// ==============================

// 📩 Send OTP (forgot password)
router.post("/forgot-password", forgotPassword);

// 🔒 Reset password (OTP + new password)
router.post("/reset-password", resetPassword);


// ==============================
// 🔐 PROTECTED ROUTES (FUTURE)
// ==============================

// router.get("/profile", protect, getUserProfile);


// ==============================
// 🔁 OPTIONAL FEATURES
// ==============================

// router.post("/resend-otp", resendOtp);
// router.post("/logout", logoutUser);

export default router;