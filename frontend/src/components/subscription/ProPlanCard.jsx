import React from "react";
import { Star, CheckCircle2, ChevronRight, Cloud, Lock, Palette, ShieldCheck, Zap, Loader2 } from "lucide-react";

export default function ProPlanCard({ 
  onSubscribe,     // 🔥 Parent-ல இருந்து வர்ற Modal Open ஃபங்க்ஷன்
  billingCycle,    // 🔥 'monthly' அல்லது 'yearly' ஸ்டேட்
  setBillingCycle, // 🔥 ஸ்டேட்டை அப்டேட் பண்ணும் ஃபங்க்ஷன்
  isCurrent,       // 🔥 இது ஏற்கனவே யூசர் வச்சிருக்க பிளானான்னு செக் பண்ண
  isLoading        // ⏳ லோடிங் ஆகுதான்னு செக் பண்ண (புதுசு)
}) {

  return (
    <div className="rounded-3xl shadow-xl overflow-hidden border border-blue-200 animate-fade-in bg-white">
      
      {/* HEADER: PREMIUM THEME */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white relative">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase">PRO PLAN</h2>
            <p className="text-blue-100 font-medium mt-1">The Ultimate Business Tool</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10">
            <Star size={32} className="text-yellow-400 fill-yellow-400" />
          </div>
        </div>
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
      </div>

      {/* PRICING & TOGGLE */}
      <div className="bg-white p-8 border-b border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <div className="flex bg-gray-100 p-1.5 rounded-xl w-fit border border-gray-200 shadow-inner">
            <button 
              onClick={() => setBillingCycle("monthly")} 
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${billingCycle === "monthly" ? "bg-white text-gray-900 shadow-md" : "text-gray-500 hover:text-gray-700"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle("yearly")} 
              className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${billingCycle === "yearly" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-gray-500 hover:text-gray-700"}`}
            >
              Yearly <span className="bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">SAVE ₹400</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-5xl font-black text-gray-900">
                {billingCycle === 'monthly' ? '₹199' : '₹1,999'}
              </span>
              <span className="text-lg text-gray-500 font-bold">
                / {billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            </div>
            {billingCycle === 'yearly' && (
              <p className="text-sm font-bold text-emerald-600 mt-2 bg-emerald-50 inline-block px-3 py-1 rounded-md border border-emerald-100">
                ✨ Recommended: You save ₹400 every year!
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 w-full md:w-auto">
            
            {/* 🔥 API BUTTON WITH LOADING STATE 🔥 */}
            <button 
              onClick={onSubscribe} 
              disabled={isCurrent || isLoading}
              className={`w-full md:w-auto px-12 py-4 rounded-xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${
                isCurrent 
                ? 'bg-emerald-500 text-white cursor-default' 
                : isLoading
                  ? 'bg-blue-400 text-white cursor-wait opacity-80'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/30 hover:-translate-y-1'
              }`}
            >
              {isLoading ? (
                <> <Loader2 size={20} className="animate-spin" /> Processing... </>
              ) : isCurrent ? (
                <> Current Plan Active </>
              ) : (
                <> Upgrade to PRO <Zap size={20} className="fill-white" /> </>
              )}
            </button>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <Lock size={12}/> SSL Secured Payment
            </p>
          </div>
        </div>
      </div>

      {/* FEATURES & INFO */}
      <div className="bg-[#FAFAFA] p-8">
        
        {/* 🔥 CORE SELLING POINT: CLOUD STORAGE */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-center gap-5 mb-8 shadow-sm">
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-600 shrink-0 shadow-inner">
            <Cloud size={28}/>
          </div>
          <div>
            <h4 className="font-black text-lg flex items-center gap-2">
              Cloud Storage Enabled <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Amazon S3</span>
            </h4>
            <p className="text-sm font-medium opacity-90 mt-1 leading-relaxed">
              All your quotations are auto-saved to the cloud. Access them anytime, from any device. Safe even if your phone is lost or damaged.
            </p>
          </div>
        </div>

        {/* FEATURE LIST GRID */}
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Everything in PRO</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <FeatureItem icon={<CheckCircle2 size={18} className="text-emerald-500" />} text="500 Quotations per month" />
          <FeatureItem icon={<Palette size={18} className="text-blue-500" />} text="Premium Templates (10+)" />
          <FeatureItem icon={<CheckCircle2 size={18} className="text-emerald-500" />} text="Clean Professional PDF (NO Watermark)" />
          <FeatureItem icon={<Palette size={18} className="text-blue-500" />} text="Custom Logo & Branding" />
          <FeatureItem icon={<ShieldCheck size={18} className="text-purple-500" />} text="Save Client Details & Reuse Data" />
          <FeatureItem icon={<CheckCircle2 size={18} className="text-emerald-500" />} text="Share via WhatsApp & Email" />
        </div>

      </div>
    </div>
  );
}

// Reusable Feature Item Component
function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-start gap-3 text-[15px] font-medium text-slate-700 leading-snug">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <span>{text}</span>
    </div>
  );
}