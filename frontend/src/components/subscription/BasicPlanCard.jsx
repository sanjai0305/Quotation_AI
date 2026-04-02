import React from "react";
import { Crown, CheckCircle2, ChevronRight, AlertTriangle, Calendar, Smartphone, Lock, Loader2 } from "lucide-react";

export default function BasicPlanCard({ 
  onSubscribe,     // 🔥 Parent-ல இருந்து வர்ற API ஃபங்க்ஷன்
  billingCycle,    // 🔥 'monthly' அல்லது 'yearly' ஸ்டேட்
  setBillingCycle, // 🔥 ஸ்டேட்டை அப்டேட் பண்ணும் ஃபங்க்ஷன்
  isCurrent,       // 🔥 இது ஏற்கனவே யூசர் வச்சிருக்க பிளானான்னு செக் பண்ண
  isLoading        // ⏳ லோடிங் ஆகுதான்னு செக் பண்ண (புதுசு)
}) {

  return (
    <div className="rounded-3xl shadow-xl overflow-hidden border border-amber-200 animate-fade-in bg-white">
      
      {/* HEADER: LAUNCH OFFER & THEME */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white relative">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase">BASIC PLAN</h2>
            <p className="text-white/90 font-medium mt-1">Great for startups & local use</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <Crown size={32} />
          </div>
        </div>

        {/* LAUNCH OFFER TIMELINE */}
        <div className="mt-6 bg-white/10 p-4 rounded-xl border border-white/20">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span>LAUNCH: MAY 3</span>
            <span>ENDS: MAY 31</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="bg-yellow-300 w-[80%] h-full animate-pulse"></div>
          </div>
          <p className="text-[11px] mt-2 font-bold uppercase tracking-wider text-yellow-100 flex items-center gap-1">
            ✨ Claim 3 Months Free Access!
          </p>
        </div>
      </div>

      {/* PRICING & TOGGLE */}
      <div className="bg-white p-8 border-b border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit border border-gray-200">
            <button 
              onClick={() => setBillingCycle("monthly")} 
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${billingCycle === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle("yearly")} 
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${billingCycle === "yearly" ? "bg-amber-500 text-white shadow-md" : "text-gray-500"}`}
            >
              Yearly <span className="bg-black/20 text-[10px] px-1.5 py-0.5 rounded-full uppercase">SAVE 16%</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-5xl font-black text-gray-900">{billingCycle === 'monthly' ? '₹99' : '₹999'}</span>
              <span className="text-gray-500 font-bold">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>
            {billingCycle === 'yearly' && <p className="text-sm font-bold text-emerald-600 mt-2">✨ You save ₹189 per year</p>}
          </div>

          <div className="flex flex-col items-center gap-2 w-full md:w-auto">
            
            {/* 🔥 API BUTTON WITH LOADING STATE 🔥 */}
            <button 
              onClick={onSubscribe} 
              disabled={isCurrent || isLoading}
              className={`w-full md:w-auto px-10 py-4 rounded-xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-2 
                ${isCurrent 
                  ? 'bg-emerald-500 text-white cursor-default' 
                  : isLoading 
                    ? 'bg-amber-400 text-white cursor-wait opacity-80' 
                    : 'bg-amber-500 text-white hover:bg-amber-600 hover:-translate-y-1 shadow-amber-200'}`}
            >
              {isLoading ? (
                <> <Loader2 size={20} className="animate-spin" /> Processing... </>
              ) : isCurrent ? (
                <> <CheckCircle2 size={20} /> Active Plan </>
              ) : (
                <> Subscribe Basic <ChevronRight size={20} /> </>
              )}
            </button>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Lock size={12}/> Secure Checkout
            </p>
          </div>
        </div>
      </div>

      {/* FEATURES & INFO SECTION */}
      <div className="bg-[#FAFAFA] p-8">
        
        {/* LOCAL STORAGE HIGHLIGHT */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900 flex items-center gap-5 mb-6 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-200 shrink-0 text-amber-700">
            <Smartphone size={24}/>
          </div>
          <div>
            <h4 className="font-bold text-lg">Local Storage Only</h4>
            <p className="text-sm font-medium opacity-80 leading-relaxed">
              Data saved securely on your device. (Cloud backup available in PRO plan)
            </p>
          </div>
        </div>

        {/* FEATURE LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <FeatureItem text="20 Quotations per day" />
          <FeatureItem text="Basic Templates included" />
          <FeatureItem text="PDF Download Available" />
          <FeatureItem text="Watermark included on PDFs" />
        </div>

        {/* JOINING INFO */}
        <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <Calendar size={20} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-gray-700 leading-relaxed">
            Users joining after June 1 get a <strong className="text-gray-900">10-Day Free Trial</strong> (₹5 verification setup required).
          </p>
        </div>

        {/* ALERT WARNING */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-700 leading-relaxed">
            <strong className="font-bold">After free period ends:</strong> You must subscribe to continue full access. Usage limit drops to <strong className="font-black text-red-900">10 per day</strong> if not subscribed.
          </p>
        </div>

      </div>
    </div>
  );
}

// Reusable Feature Item Component
function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3 text-[15px] font-medium text-gray-700">
      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> {text}
    </div>
  );
}