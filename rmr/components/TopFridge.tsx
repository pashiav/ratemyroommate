import React from "react";

export default function FridgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // add the top part of the fridge, the shine on the left and right, the handle, and the content in the middle
    <div
      className="bg-[#f5f5f5] rounded-[96px] shadow-lg p-8 min-h-[50rem] relative z-0 overflow-hidden"
      style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.2)" }}
    >
      <img
        src="/handle-short.png"
        alt="Fridge Handle"
        className="absolute left-0 ml-24 top-0 mt-40 w-36 h-auto object-contain z-10"
      />
      <img
        src="/shine-left-crop.png"
        alt="shine"
        className="absolute left-0 top-0 mt-3 ml-3 w-xs h-auto object-contain z-10"
      />
      <img
        src="/shine-right-crop.png"
        alt="shine"
        className="absolute right-0 top-0 mt-3 mr-3 w-xs h-auto object-contain z-10"
      />
      {children}
    </div>
  );
}
