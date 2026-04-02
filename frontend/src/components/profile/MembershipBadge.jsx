import React, { useState } from "react";
import { Crown, CheckCircle2, AlertCircle, CreditCard, Calendar, Zap, ShieldCheck } from "lucide-react";

export default function MembershipBadge({ user }) {
  const [isYearly, setIsYearly] = useState(true);

  // 🕒 12 Days Trial Logic Calculation
  const calculateTrialDays = () => {
    if (!user?.createdAt) return 12; 
    const createdAt = new Date(user.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - createdAt);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const remaining = 12 - diffDays;
    return remaining;
  };

  const remainingDays = calculateTrialDays();
  const isTrialActive = remainingDays > 0;
  const isExpired = remainingDays <= 0;
  
  // Assuming a field like user.plan exists (e.g., 'free', 'pro')
  const userPlan = user?.plan || 'free'; 
  const isPro = userPlan === 'pro';

  const handleUpgrade = (planType) => {
    // Inga unga payment gateway (Razorpay/Stripe) integration varum
    alert(`Redirecting to payment gateway for ${planType} plan...`);
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      
      {/* 🟢 TOP SECTION: CURRENT PLAN STATUS */}
      <div className={`p-8 border-b ${isPro ? 'bg-blue-50' : isExpired ? 'bg-red-50' : 'bg-amber-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner
              ${isPro ? 'bg-blue-600 text-white' : isExpired ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
              {isPro ? <ShieldCheck size={28} /> : isExpired ? <AlertCircle size={28} /> : <Crown size={28} />}
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Current Plan</p>
              <h2 className={`text-2xl font-black tracking-tight 
                ${isPro ? 'text-blue-700' : isExpired ? 'text-red-700' : 'text-amber-700'}`}>
                {isPro ? "QuoteGen Pro" : isExpired ? "Trial Expired" : "12-Day Free Trial"}
              </h2>
            </div>
          </div>

          {!isPro && (
            <div className="text-right">
              {isTrialActive ? (
                <>
                  <p className="text-3xl font-black text-amber-600">{remainingDays}</p>
                  <p className="text-xs font-bold text-amber-700/70 uppercase tracking-widest">Days Left</p>
                </>
              ) : (
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> Upgrade Required
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar for Trial */}
        {!isPro && isTrialActive && (
          <div className="mt-6">
            <div className="flex justify-between text-xs font-bold text-amber-700/70 mb-2">
              <span>Day 1</span>
              <span>Day 12</span>
            </div>
            <div className="w-full bg-amber-200/50 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${((12 - remainingDays) / 12) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* 💳 BOTTOM SECTION: UPGRADE PLANS */}
      {!isPro && (
        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Upgrade to Pro</h3>
              <p className="text-sm text-gray-500 mt-1">Unlock unlimited quotations, PDF exports, and email sharing.</p>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${!isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${isYearly ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Yearly <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">Save 16%</span>
              </button>
            </div>
          </div>

          {/* Pricing Card */}
          <div className={`border-2 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${isYearly ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 bg-white'}`}>
            {isYearly && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Best Value</div>}
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="flex-1">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-black text-gray-900">₹{isYearly ? '999' : '99'}</span>
                  <span className="text-gray-500 font-medium mb-1">/ {isYearly ? 'year' : 'month'}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">Billed {isYearly ? 'annually' : 'monthly'}. Cancel anytime.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Unlimited Quotations</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> PDF Downloads</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> WhatsApp & Email Share</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Remove Watermarks</div>
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <button 
                  onClick={() => handleUpgrade(isYearly ? 'Yearly' : 'Monthly')}
                  className="w-full sm:w-48 bg-gray-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-0.5"
                >
                  <Zap size={18} /> Upgrade Now
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-3 font-semibold uppercase tracking-widest flex items-center justify-center gap-1">
                  <CreditCard size={12} /> Secure Checkout
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}