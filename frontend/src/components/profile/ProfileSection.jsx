import React, { useState, useEffect, useRef } from "react";
import { LogOut, User, Crown, Phone, Mail, ChevronUp } from "lucide-react";

export default function ProfileSection({ 
  user, 
  onLogout, 
  goToSettings, 
  goToEditProfile 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // 🔥 UX FIX: Close the popup if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🕒 12 Days Trial Logic
  const calculateTrialDays = () => {
    if (!user?.createdAt) return 12; // Default to 12 days if no date is provided
    
    const createdAt = new Date(user.createdAt);
    const today = new Date();
    
    const diffTime = Math.abs(today - createdAt);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const remaining = 12 - diffDays;
    return remaining > 0 ? remaining : 0;
  };

  const trialDays = calculateTrialDays();
  const isTrial = trialDays > 0;

  // ✅ SAFE DATA EXTRACTION (Prevents crashing and handles empty data better)
  const userName = user?.name || "Admin User";
  const userEmail = user?.email || "No Email Linked";
  const userMobile = user?.mobile || "No Mobile Linked";
  
  // Safe Avatar URL generation
  const avatarUrl = user?.profilePic 
    ? user.profilePic 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff&bold=true`;

  return (
    <div className="relative w-full" ref={menuRef}>
      
      {/* 🔼 POPUP MENU */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-3 bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
          
          {/* User Details Header */}
          <div className="p-4 border-b border-slate-700/50 bg-slate-800/40">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">User Details</p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Phone size={14} className="text-blue-400 shrink-0" />
                <span className="font-medium truncate">{userMobile}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <span className="font-medium truncate">{userEmail}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-2 space-y-1">
            <button 
              onClick={() => { setIsOpen(false); if (goToEditProfile) goToEditProfile(); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-xl transition-all"
            >
              <User size={16} /> Edit Profile
            </button>
            
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* 👤 MAIN PROFILE CARD */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-2xl flex items-center justify-between border transition-all cursor-pointer group
          ${isOpen ? 'bg-slate-800 border-slate-600' : 'bg-slate-800/40 border-slate-800/50 hover:bg-slate-800/60'}
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          
          {/* Avatar with Online Indicator */}
          <div className="relative shrink-0">
            <img 
              src={avatarUrl} 
              alt={userName} 
              className="w-9 h-9 rounded-xl object-cover border border-slate-700 bg-slate-800"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0B1120] rounded-full"></div>
          </div>
          
          {/* Name & Plan Badge */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate max-w-[110px]" title={userName}>
              {userName}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Crown size={10} className={isTrial ? "text-amber-400 shrink-0" : "text-blue-400 shrink-0"} />
              <span className={`text-[9px] font-black uppercase tracking-tighter truncate ${isTrial ? 'text-amber-400/80' : 'text-blue-400'}`}>
                {isTrial ? `${trialDays} Days Trial` : "Pro Plan"}
              </span>
            </div>
          </div>

        </div>
        
        {/* Animated Chevron */}
        <ChevronUp size={16} className={`text-slate-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

    </div>
  );
}