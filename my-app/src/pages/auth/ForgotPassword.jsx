import React from "react";
import illustration from "../../assets/register.png";

export default function ForgotPassword({ goToLogin }) {
  return (
    <div className="min-h-screen w-full flex bg-gradient-to-r from-slate-100 to-blue-100">
      
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 md:px-12">
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-md">
              📄
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              QuoteGen Pro
            </h2>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-500 mb-6">
            Enter your registered email or mobile number to reset your password
          </p>

          {/* Input */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">
                Email / Mobile Number
              </label>

              <div className="flex mt-1 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
                
                {/* Country Code */}
                <div className="px-3 flex items-center bg-gray-100 text-gray-600 text-sm">
                  +91
                </div>

                {/* Input */}
                <input
                  type="text"
                  placeholder="Enter email or mobile number"
                  className="w-full px-4 py-3 focus:outline-none"
                />
              </div>
            </div>

            {/* 🔥 BUTTON FIX */}
            <button
              type="button"
              className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 transition"
            >
              Send OTP
            </button>
          </div>

          {/* 🔥 LOGIN NAVIGATION FIX */}
          <p className="text-sm text-gray-500 mt-6">
            Remember your password?{" "}
            <span
              onClick={goToLogin}
              className="text-blue-500 font-medium cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute w-[500px] h-[500px] bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

        {/* Small Glow */}
        <div className="absolute w-[300px] h-[300px] bg-white opacity-30 rounded-full blur-2xl top-10 right-10"></div>

        {/* Image */}
        <img
          src={illustration}
          alt="illustration"
          className="relative w-[75%] max-w-lg drop-shadow-2xl transition-transform duration-500 hover:scale-105"
        />
      </div>

    </div>
  );
}