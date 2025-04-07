import React from "react";

export default function FridgeLayout({ children }: { children: React.ReactNode }) {
  return (
    // add the top part of the fridge, the shine on the left and right, the handle, and the content in the middle
    <div className="bg-[#f5f5f5] rounded-[96px] shadow-lg p-8 min-h-screen relative">
      <img src="/handle.png" alt="Fridge Handle" className="absolute left-0 ml-24 top-1/3 w-36 h-auto object-contain" />
      <img src="/shine-left.png" alt="shine" className="absolute left-0 top-0 mt-6 ml-6 w-xs h-auto object-contain" />
      <img src="/shine-right.png" alt="shine" className="absolute right-0 top-0 mt-6 mr-6 w-xs h-auto object-contain" />
      {children}
    </div>
  );
}
