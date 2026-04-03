import React from "react";
import { Layout, Printer, Download, Edit3, CheckCircle2 } from "lucide-react";

export default function TemplateSelector({ selected, onSelect, onPrint, onExport, onEdit }) {
  // 6 Industry Standard Templates (Including the Grouped style)
  const templates = [
    { id: "classic", name: "Classic", color: "bg-slate-500" },
    { id: "modern", name: "Modern", color: "bg-blue-600" },
    { id: "corporate", name: "Corporate", color: "bg-amber-700" },
    { id: "compact", name: "Compact", color: "bg-emerald-600" },
    { id: "creative", name: "Creative", color: "bg-purple-600" },
    { id: "grouped", name: "Grouped", color: "bg-rose-500" }, // Added Grouped Template
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-6 py-4 flex flex-col xl:flex-row items-center justify-between shadow-sm sticky top-0 z-20 print:hidden gap-4 transition-all">
      
      {/* 📑 TEMPLATE TABS (Scrollable on small screens) */}
      <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto no-scrollbar pb-1 xl:pb-0">
        
        {/* Label */}
        <div className="flex items-center gap-2 text-slate-400 border-r border-gray-200 pr-4 shrink-0">
           <Layout size={18} />
           <span className="text-xs font-black uppercase tracking-widest hidden sm:inline-block">Templates</span>
        </div>

        {/* Buttons Wrapper */}
        <div className="flex bg-gray-100/80 p-1.5 rounded-xl gap-1 shrink-0 border border-gray-200/50">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                selected === t.id 
                ? "bg-white text-gray-900 shadow-sm border border-gray-200/50 scale-105" 
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-200/50"
              }`}
            >
              {/* Colored Dot Indicator */}
              <div className={`w-2 h-2 rounded-full ${t.color} ${selected === t.id ? 'animate-pulse' : ''}`}></div>
              {t.name}
              {selected === t.id && <CheckCircle2 size={14} className="text-blue-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* ⚙️ ACTION BUTTONS */}
      <div className="flex items-center gap-3 shrink-0 ml-auto xl:ml-0">
        
        <button 
          onClick={onEdit} 
          className="p-2.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-transparent hover:border-blue-100" 
          title="Edit Details"
        >
          <Edit3 size={18} />
        </button>

        <button 
          onClick={onPrint} 
          className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-gray-200" 
          title="Print PDF"
        >
          <Printer size={18} />
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

        <button 
          onClick={onExport}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Download size={18} /> 
          <span className="hidden sm:inline">Export / Share</span>
          <span className="sm:hidden">Export</span>
        </button>

      </div>
    </div>
  );
}