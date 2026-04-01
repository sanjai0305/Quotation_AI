import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Invalid mobile number"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔐 hide password by default
    },

    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false, // 🔥 IMPORTANT (OTP verify needed)
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 Optional: remove sensitive fields in response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.otp;
  delete user.otpExpires;
  return user;
};

export default mongoose.model("User", userSchema);