import React from "react";
import { User, Mail, Phone, Save, Loader2, Briefcase, MapPin, AlignLeft } from "lucide-react";

export default function ProfileForm({
  userForm,
  handleInputChange,
  isLoading,
  goToSettings,
}) {
  return (
    <div className="flex-1 w-full flex flex-col justify-between">
      
      {/* 📝 FORM FIELDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <User size={14} /> Full Name
          </label>
          <input 
            type="text" 
            name="name" 
            value={userForm?.name || ""} 
            onChange={handleInputChange} 
            required 
            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white"
            placeholder="Enter your full name" 
          />
        </div>

        {/* Email Address (Read-only) */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Mail size={14} /> Email Address (Read-only)
          </label>
          <div className="w-full border border-slate-200 rounded-xl px-4 py-3.5 bg-slate-100 text-sm font-bold text-slate-500 cursor-not-allowed">
            {userForm?.email || "No email provided"}
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Contact support to change.</p>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Phone size={14} /> Mobile Number
          </label>
          <input 
            type="text" 
            name="mobile" 
            value={userForm?.mobile || ""} 
            onChange={handleInputChange} 
            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white"
            placeholder="+91 98765 43210" 
          />
        </div>

        {/* Job Title / Designation */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Briefcase size={14} /> Job Title
          </label>
          <input 
            type="text" 
            name="designation" 
            value={userForm?.designation || ""} 
            onChange={handleInputChange} 
            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white"
            placeholder="e.g. Sales Manager" 
          />
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <MapPin size={14} /> Location
          </label>
          <input 
            type="text" 
            name="location" 
            value={userForm?.location || ""} 
            onChange={handleInputChange} 
            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white"
            placeholder="e.g. Chennai, TN" 
          />
        </div>

        {/* Bio / About Me */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <AlignLeft size={14} /> Short Bio
          </label>
          <textarea 
            name="bio" 
            value={userForm?.bio || ""} 
            onChange={handleInputChange} 
            rows="3"
            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white"
            placeholder="Write a few lines about yourself..." 
          />
        </div>

      </div>

      {/* 🔘 ACTION BUTTONS */}
      <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end gap-4">
        <button 
          type="button" 
          onClick={goToSettings}
          className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
        >
          Cancel
        </button>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </div>

    </div>
  );
}