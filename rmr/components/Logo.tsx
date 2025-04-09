import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center justify-between w-full h-16 bg-[#f5f5f5] rounded-[96px] shadow-lg p-4">
      <img
        src="/logo.png"
        alt="Logo"
        className="w-16 h-16 object-contain left-0 "
      />
    </div>
  );
}
