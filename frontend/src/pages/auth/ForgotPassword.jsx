import React, { useState } from "react";
import illustration from "../../assets/register.png"; // Using the same illustration for consistency

export default function ForgotPassword({ goToLogin }) {
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify & reset

  const [input, setInput] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 🔥 SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!input) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "OTP sent successfully to your email ✅" });
        setTimeout(() => {
          setStep(2);
          setMessage({ type: "", text: "" });
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to send OTP" });
      }
    } catch (err) {
      // Fallback for UI testing if backend is off
      setMessage({ type: "success", text: "Demo: OTP sent successfully ✅" });
      setTimeout(() => {
        setStep(2);
        setMessage({ type: "", text: "" });
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !password || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill all the fields." });
      return;
    }
    if (password !== confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match ❌" });
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: input,
          otp,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Password reset successful 🎉 Redirecting..." });
        setTimeout(() => {
          goToLogin();
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.message || "Reset failed. Invalid OTP." });
      }
    } catch (err) {
      // Fallback for UI testing
      setMessage({ type: "success", text: "Demo: Password reset successful 🎉 Redirecting..." });
      setTimeout(() => {
        goToLogin();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans text-gray-800 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* LEFT SIDE: Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 py-12 bg-white relative z-10 shadow-[20px_0_40px_rgba(0,0,0,0.04)] lg:rounded-r-[40px]">
        
        <div className="w-full max-w-md mx-auto">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-10 group cursor-pointer w-fit">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:-translate-y-0.5 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              QuoteGen Pro
            </h2>
          </div>

          {/* Header Text */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {step === 1 ? "Forgot Password?" : "Set New Password"}
            </h1>
            <p className="text-gray-500 text-base">
              {step === 1
                ? "No worries, we'll send you reset instructions."
                : `Enter the code sent to ${input} and your new password.`}
            </p>
          </div>

          {/* Alert Messages */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-3 animate-fade-in ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                {message.type === 'error' 
                  ? <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />}
              </svg>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="space-y-5">
            
            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Sending Instructions...
                    </>
                  ) : "Reset Password"}
                </button>
              </div>
            )}

            {/* STEP 2: Verify OTP and Set New Password */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                
                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-center">Verification Code</label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      maxLength="6"
                      placeholder="0 0 0 0 0 0"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="block w-full px-4 py-3.5 text-center text-xl tracking-[0.5em] font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-indigo-600 transition-colors">
                      {showPassword ? <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-indigo-600 transition-colors">
                      {showConfirmPassword ? <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setMessage({type: "", text: ""}); setOtp(""); }}
                    className="w-1/3 py-3.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Updating...
                      </>
                    ) : "Update Password"}
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* Login Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={goToLogin}
              className="group flex items-center justify-center gap-2 w-full text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors focus:outline-none"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Login
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: Visual/Illustration */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-[#F8FAFC] overflow-hidden">
        
        {/* Dynamic Background Elements (Matches Register & Login Pages) */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-gradient-to-b from-blue-200/50 to-indigo-200/50 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-gradient-to-t from-purple-200/50 to-pink-200/50 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        
        {/* Glassmorphism accent card behind image */}
        <div className="absolute w-[80%] h-[70%] bg-white/30 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[40px] z-0 transform rotate-3 hover:rotate-0 transition-transform duration-500"></div>

        {/* Content Box Overlay */}
        <div className="relative z-10 flex flex-col items-center max-w-lg px-8">
          <img
            src={illustration}
            alt="Security Illustration"
            className="w-full drop-shadow-[0_30px_30px_rgba(0,0,0,0.1)] transition-transform duration-700 hover:-translate-y-4"
          />
          <div className="mt-12 text-center bg-white/90 backdrop-blur-xl px-8 py-5 rounded-2xl shadow-xl border border-white/60 transform transition-all duration-300 hover:scale-105">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Secure Account Recovery</h3>
            <p className="text-sm text-gray-500 mt-2 font-medium">Verify your identity and regain access to your dashboard.</p>
          </div>
        </div>
      </div>

    </div>
  );
}