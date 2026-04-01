import React from "react";
import {
  LayoutDashboard,
  FileText,
  Eye,
  Download,
  Settings,
  Sparkles,
  LogOut,
  LifeBuoy
} from "lucide-react";

export default function Sidebar({
  active = "dashboard",
  goToCreate,
  goToDashboard,
  goToPreview,
  goToExport,
  goToSettings,
}) {
  return (
    <div className="w-[250px] bg-[#0B1120] text-slate-300 h-screen p-5 flex flex-col justify-between fixed left-0 top-0 border-r border-slate-800/60 shadow-2xl z-50">

      {/* TOP SECTION */}
      <div>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:-translate-y-0.5">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">QuoteGen Pro</h1>
            <p className="text-[10px] text-blue-400 tracking-widest font-semibold uppercase">Enterprise</p>
          </div>
        </div>

        {/* MAIN MENU */}
        <div className="mb-8">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-3 px-3">
            Main Menu
          </p>

          <div className="space-y-1.5">
            <MenuItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={active === "dashboard"}
              onClick={goToDashboard}
            />

            <MenuItem
              icon={<FileText size={18} />}
              label="Create Quote"
              active={active === "create"}
              onClick={goToCreate}
            />

            <MenuItem
              icon={<Eye size={18} />}
              label="Preview"
              active={active === "preview"}
              onClick={goToPreview}
            />

            <MenuItem
              icon={<Download size={18} />}
              label="Export"
              active={active === "export"}
              onClick={goToExport}
            />
          </div>
        </div>

        {/* SYSTEM MENU */}
        <div>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-3 px-3">
            System
          </p>
          
          <div className="space-y-1.5">
            <MenuItem
              icon={<Settings size={18} />}
              label="Settings"
              active={active === "settings"}
              onClick={goToSettings}
            />
            <MenuItem
              icon={<LifeBuoy size={18} />}
              label="Help & Support"
              active={active === "help"}
              onClick={() => {}}
            />
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION / USER PROFILE */}
      <div className="mt-auto pt-5 border-t border-slate-800/60">
        <div className="bg-slate-800/30 rounded-xl p-3 flex items-center justify-between border border-slate-800/50 hover:bg-slate-800/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Admin User</span>
              <span className="text-[10px] text-slate-400">Pro Plan</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-red-400 transition-colors focus:outline-none">
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}

/* 🔥 REUSABLE MENU ITEM WITH PREMIUM EFFECTS */
function MenuItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick || (() => {})}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
        active
          ? "text-white bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
          : "text-slate-400 hover:text-white hover:bg-slate-800/80"
      }`}
    >
      {/* Tiny active indicator glow (Optional nice touch) */}
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