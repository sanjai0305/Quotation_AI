import React from "react";
import illustration from "../../assets/register.png";

export default function Login({ goToRegister, goToForgot, goToDashboard }) {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Login</h1>
          <p className="text-gray-500 mb-6">
            Sign in to your account
          </p>

          {/* Form */}
          <form className="space-y-4">
            
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-blue-500" />
                Remember Me
              </label>

              {/* 🔥 FIX */}
              <span
                onClick={goToForgot}
                className="text-blue-500 cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>

            {/* 🔥 FIX */}
            <button
              type="button"
              onClick={goToDashboard}
              className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          {/* 🔥 FIX */}
          <p className="text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <span
              onClick={goToRegister}
              className="text-blue-500 font-medium cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden">
        
        <div className="absolute w-[500px] h-[500px] bg-blue-400 opacity-20 rounded-full blur-3xl"></div>

        <div className="absolute w-[300px] h-[300px] bg-white opacity-30 rounded-full blur-2xl top-10 right-10"></div>

        <img
          src={illustration}
          alt="illustration"
          className="relative w-[75%] max-w-lg drop-shadow-2xl transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
}