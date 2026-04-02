import React, { useState } from "react";
import Sidebar from "./Sidebar"; 
import { Crown, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";

export default function ManageSubscription({ 
  user, 
  goToDashboard, 
  goToCreate, 
  goToExport, 
  goToEditProfile,
  goToSubscription, // ✅ Added for safety
  goToSettings,     // 🔥 App.jsx-ல் இருந்து வரும் Prop
  goToHelp          // 🔥 App.jsx-ல் இருந்து வரும் Prop
}) {
  const [billingCycle, setBillingCycle] = useState("yearly");

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-100 text-gray-800">
      
      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <Sidebar 
          active="subscription" 
          user={user} 
          goToDashboard={goToDashboard} 
          goToCreate={goToCreate} 
          goToExport={goToExport} 
          goToSubscription={goToSubscription || (() => {})} 
          goToSettings={goToSettings} // 🔥 Sidebar-க்கு பாஸ் செய்யப்படுகிறது
          goToHelp={goToHelp}         // 🔥 Sidebar-க்கு பாஸ் செய்யப்படுகிறது
          goToEditProfile={goToEditProfile}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="ml-[250px] min-h-screen flex flex-col relative pb-20">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200/50 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Manage Subscription</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">View and manage your current billing plan.</p>
          </div>
        </div>

        {/* BODY */}
        <div className="p-10 max-w-3xl mx-auto w-full mt-4 animate-fade-in">
          
          {/* TOP BANNER - CURRENT PLAN */}
          <div className="bg-[#FFF8F0] border border-[#FFE8D6] rounded-t-3xl p-8 shadow-sm">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-14 h-14 bg-[#FFE8D6] text-[#D97706] rounded-2xl flex items-center justify-center shadow-inner border border-[#FCD34D]">
                <Crown size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Current Plan Status</p>
                <h2 className="text-3xl font-black text-[#92400E] tracking-tight uppercase">
                  {user?.plan === 'pro' ? 'Pro Plan' : 'Basic Plan'}
                </h2>
                <p className="text-sm font-medium text-amber-600 mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Launch Offer Active
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-xs font-black text-[#92400E] mb-2 px-1 uppercase tracking-tighter">
                <span>Joined: May 3</span>
                <span>Offer Ends: May 31</span>
              </div>
              <div className="w-full bg-[#FDE68A] h-2.5 rounded-full overflow-hidden border border-amber-200">
                <div className="bg-[#F59E0B] w-[85%] h-full rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* MAIN PRICING CARD */}
          <div className="bg-white border-x border-b border-gray-200 rounded-b-3xl p-8 shadow-xl shadow-slate-200/50">
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Upgrade or Extend</h3>
                <p className="text-sm font-medium text-gray-400 mt-1">Select your preferred billing cycle</p>
              </div>
              
              <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
                <button 
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${billingCycle === "monthly" ? "bg-white text-gray-900 shadow-md scale-105" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${billingCycle === "yearly" ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Yearly <span className="bg-black/20 text-[10px] px-2 py-0.5 rounded-full">Save 16%</span>
                </button>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="border-2 border-blue-500 bg-blue-50/10 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 relative z-10">
                <div className="text-center md:text-left">
                  <div className="flex items-baseline justify-center md:justify-start gap-1.5">
                    <span className="text-5xl font-black text-gray-900 tracking-tighter">
                      {billingCycle === 'monthly' ? '₹99' : '₹999'}
                    </span>
                    <span className="text-gray-400 font-bold text-lg">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  <p className="text-sm font-bold text-blue-600 mt-2 bg-blue-50 inline-block px-3 py-1 rounded-lg">
                    {billingCycle === 'monthly' ? 'Standard Billing' : '✨ Best Value: Save ₹189 yearly'}
                  </p>
                </div>
                
                <button className="bg-slate-900 hover:bg-black text-white font-black py-4 px-8 rounded-2xl flex items-center gap-2 transition-all shadow-xl hover:-translate-y-1 active:scale-95 group">
                  Continue {user?.plan === 'pro' ? 'PRO' : 'BASIC'} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Promo Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-500 rounded-2xl p-5 text-center shadow-lg relative z-10">
                <p className="font-black text-white text-lg flex items-center justify-center gap-2">
                  🎉 3 MONTHS FREE ACCESS
                </p>
                <p className="text-xs font-bold text-blue-100 mt-1 uppercase tracking-widest opacity-90">
                  Early Adopter Reward • Valid till May 31
                </p>
              </div>
            </div>

            {/* FEATURES LIST */}
            <div className="mt-10 bg-[#FAFAFA] border border-gray-100 rounded-3xl p-8">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                Plan Inclusions
              </h4>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
                <FeatureItem text="20 Quotations per day limits" />
                <FeatureItem text="10-Day Trial for new users" />
                <FeatureItem text="Watermark on PDF exports" />
                <FeatureItem text="Local storage only" />
              </ul>

              {/* UPGRADE HINT */}
              <div onClick={goToDashboard} className="mt-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-emerald-100/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-emerald-900 leading-tight">Switch to PRO Plan</p>
                    <p className="text-xs font-medium text-emerald-700 mt-0.5">Unlock Cloud Backup & Premium Templates</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <li className="flex items-start gap-3">
      <div className="p-0.5 bg-emerald-100 rounded-full mt-0.5">
        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
      </div>
      <span className="text-[14px] text-slate-600 font-semibold leading-tight">{text}</span>
    </li>
  );
}