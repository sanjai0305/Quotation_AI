import React from "react";

export default function Navbar() {
  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-end px-6">
      
      {/* Right Side */}
      <div className="flex items-center gap-4">
        
        {/* Notification */}
        <div className="relative cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
            🔔
          </div>

          {/* Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-[1px] rounded-full">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <span className="hidden md:block text-gray-600 font-medium">
            Arjun
          </span>
        </div>

      </div>
    </div>
  );
}