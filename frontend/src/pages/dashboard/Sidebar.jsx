import React from "react";
import {
  LayoutDashboard as DashboardIcon,
  FileText as FileIcon,
  Eye as EyeIcon,
  Download as ExportIcon,
  CreditCard as SubscriptionIcon,
  LifeBuoy as HelpIcon,
  Settings as SettingsIcon
} from "lucide-react";

// 🔥 IMPORT PROFILE SECTION
import ProfileSection from "../../components/profile/ProfileSection"; 

export default function Sidebar({
  active = "dashboard",
  goToCreate,
  goToDashboard,
  goToPreview,
  goToExport,
  goToSubscription, 
  goToSettings,
  goToHelp, // ✅ App.jsx-ல் இருந்து வரும் ரௌட்டிங் பங்க்ஷன்
  goToEditProfile, 
  user, 
}) {

  // ✅ SECURE LOGOUT HANDLER
  const handleLogout = () => {
    if (window.confirm("நிச்சயமாக வெளியேற வேண்டுமா? (Logout)")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); 
      window.location.href = "/"; 
    }
  };

  return (
    <div className="w-[250px] bg-[#0B1120] text-slate-300 h-screen p-5 flex flex-col justify-between fixed left-0 top-0 border-r border-slate-800/60 shadow-2xl z-50">

      {/* TOP SECTION: LOGO & MENU */}
      <div>

        {/* 🔥 CUSTOM VISION X LOGO */}
        <div 
          onClick={goToDashboard}
          className="flex items-center gap-3 mb-10 px-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:-translate-y-0.5 border border-blue-500/30 shrink-0 bg-black">
            <img src="/vision X logo.png" alt="Vision X" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black tracking-wide text-white truncate">
              vision<span className="text-blue-500">X</span>
            </h1>
            <p className="text-[8px] text-blue-400 tracking-[0.2em] font-bold uppercase mt-0.5 truncate">
              Next-Gen Tech
            </p>
          </div>
        </div>

        {/* MAIN MENU SECTION */}
        <div className="mb-8">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-3 px-3">
            Main Menu
          </p>

          <div className="space-y-1.5">
            <MenuItem
              icon={<DashboardIcon size={18} />}
              label="Dashboard"
              active={active === "dashboard"}
              onClick={goToDashboard}
            />

            <MenuItem
              icon={<FileIcon size={18} />}
              label="Create Quote"
              active={active === "create"}
              onClick={goToCreate}
            />

            <MenuItem
              icon={<EyeIcon size={18} />}
              label="Preview"
              active={active === "preview"}
              onClick={goToPreview}
            />

            <MenuItem
              icon={<ExportIcon size={18} />}
              label="Export"
              active={active === "export"}
              onClick={goToExport}
            />
          </div>
        </div>

        {/* SYSTEM SECTION */}
        <div>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-3 px-3">
            System
          </p>
          
          <div className="space-y-1.5">
            <MenuItem
              icon={<SubscriptionIcon size={18} />}
              label="Manage Subscription"
              active={active === "subscription"}
              onClick={goToSubscription}
            />
            
            {/* 🔥 Help & Support Button - இப்போ இது வேலை செய்யும் */}
            <MenuItem
              icon={<HelpIcon size={18} />}
              label="Help & Support"
              active={active === "help"}
              onClick={goToHelp} 
            />
            
            {/* 🔥 Settings Button */}
            <MenuItem
              icon={<SettingsIcon size={18} />}
              label="Settings"
              active={active === "settings"}
              onClick={goToSettings}
            />
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: USER PROFILE */}
      <div className="mt-auto pt-5 border-t border-slate-800/60">
        <ProfileSection 
          user={user} 
          onLogout={handleLogout} 
          goToSettings={goToSettings} 
          goToEditProfile={goToEditProfile} 
        />
      </div>

    </div>
  );
}

/* 🔥 REUSABLE MENU ITEM COMPONENT */
function MenuItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
        active
          ? "text-white bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
          : "text-slate-400 hover:text-white hover:bg-slate-800/80"
      }`}
    >
      {/* Active Indicator Glow */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
      )}
      
      <div className={`transition-transform duration-300 ${!active && 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className={`text-sm tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
        {label}
      </span>
    </div>
  );
}