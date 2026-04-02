import React, { useRef } from "react";
import { Camera } from "lucide-react";

export default function AvatarUpload({ 
  previewUrl, 
  userName, 
  onFileSelect 
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 shrink-0">
      
      {/* 📸 Image Container */}
      <div 
        className="relative group cursor-pointer" 
        onClick={() => fileInputRef.current.click()}
      >
        <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 relative transition-all duration-300 group-hover:shadow-md">
          <img 
            // Fallback to UI-Avatars if no previewUrl is available
            src={previewUrl || `https://ui-avatars.com/api/?name=${userName || 'User'}&background=3b82f6&color=fff&size=256`} 
            alt="Profile Avatar" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={28} className="text-white" />
          </div>
        </div>
        
        {/* Floating Camera Button */}
        <button 
          type="button"
          className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-3 rounded-xl shadow-lg border-2 border-white hover:bg-blue-700 hover:scale-105 transition-all"
        >
          <Camera size={18} />
        </button>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/jpg" 
          className="hidden" 
        />
      </div>

      {/* Helper Text */}
      <div className="text-center mt-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
          Allowed: JPG, PNG<br/>Max size: 2MB
        </p>
      </div>

    </div>
  );
}