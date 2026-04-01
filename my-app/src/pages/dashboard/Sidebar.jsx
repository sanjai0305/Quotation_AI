import {
  LayoutDashboard,
  FileText,
  Eye,
  Download,
  Settings,
} from "lucide-react";

export default function Sidebar({
  active = "dashboard",
  goToCreate,
  goToDashboard,
  goToPreview,
  goToExport,
  goToSettings, // ✅ NEW
}) {
  return (
    <div className="w-64 bg-[#0f172a] text-white h-screen p-5 flex flex-col justify-between fixed left-0 top-0">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">✨</div>
          <div>
            <h1 className="font-bold">QuotationAI</h1>
            <p className="text-xs text-gray-400">SMART QUOTATIONS</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">MENU</p>

        <div className="space-y-2">

          <MenuItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={active === "dashboard"}
            onClick={goToDashboard}
          />

          <MenuItem
            icon={<FileText size={18} />}
            label="Create"
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

          <MenuItem
            icon={<Settings size={18} />}
            label="Settings"
            active={active === "settings"} // ✅ FIXED
            onClick={goToSettings} // ✅ REAL NAVIGATION
          />

        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-[#1e293b] p-3 rounded-lg text-xs text-gray-300 text-center">
        Enterprise Ready 🚀
      </div>
    </div>
  );
}

/* 🔥 REUSABLE MENU ITEM */
function MenuItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick || (() => {})}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}