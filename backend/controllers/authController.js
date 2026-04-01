import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateOtp, { getOtpExpiry } from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";


// ==============================
// 🔐 REGISTER + SEND OTP
// ==============================
export const registerUser = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  try {
    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOtp();
    const expiry = getOtpExpiry(5);
    const hashed = await bcrypt.hash(password, 10);

    if (!user) {
      user = new User({
        name,
        mobile,
        email,
        password: hashed,
        otp,
        otpExpires: expiry,
      });
    } else {
      user.otp = otp;
      user.otpExpires = expiry;
    }

    await user.save();
    await sendEmail(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
};


// ==============================
// 🔐 VERIFY REGISTER OTP
// ==============================
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid OTP ❌" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({
      token: generateToken(user._id),
      name: user.name,
    });

  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    res.status(500).json({ message: "Verification failed" });
  }
};


// ==============================
// 🔐 LOGIN
// ==============================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isVerified) {
      return res.status(401).json({
        message: "Verify account first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials ❌",
      });
    }

    res.json({
      token: generateToken(user._id),
      name: user.name,
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};


// ==============================
// 🔁 FORGOT PASSWORD (SEND OTP)
// ==============================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If email exists, OTP sent",
      });
    }

    const otp = generateOtp();
    const expiry = getOtpExpiry(5);

    user.otp = otp;
    user.otpExpires = expiry;

    await user.save();
    await sendEmail(email, otp);

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("Forgot Error:", err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


// ==============================
// 🔁 RESET PASSWORD
// ==============================
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Min 6 chars required" });
    }

    const user = await User.findOne({ email });

    const valid =
      user &&
      user.otp === otp &&
      user.otpExpires > Date.now();

    if (!valid) {
      return res.status(400).json({
        message: "Invalid or expired OTP ❌",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.json({
      message: "Password reset successful 🎉",
    });

  } catch (err) {
    console.error("Reset Error:", err.message);
    res.status(500).json({ message: "Reset failed" });
  }
};