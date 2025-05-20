// components/BottomFridge.tsx
import React from "react";

export default function BottomFridge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div
        className="bg-[#f5f5f5] rounded-[96px] mt-0 shadow-lg p-10 min-h-[55rem] w-[100%] mx-auto relative"
        style={{ boxShadow: "0 -4px 4px -2px rgba(0, 0, 0, 0.2)" }}
      >
        <img
          src="/handle-short.png"
          alt="Fridge Handle"
          className="absolute left-0 ml-24 top-0 mt-24 w-36 h-auto object-contain z-0 pointer-events-none"
        />
        {/* Left Shine */}
        <div
          className="absolute left-[1rem] top-[0.7rem] w-48 h-48 rounded-full border-[8px] border-white pointer-events-none"
          style={{
            clipPath: "ellipse(25% 25% at 30% 30%)",
          }}
        ></div>{" "}
        <div className="absolute left-[1.25rem] top-[6.5em] h-[75%] w-[8.5px] bg-white rounded-full pointer-events-none"></div>
        <div className="absolute left-[6.5rem] top-[.8rem] w-[3rem] h-[7px] bg-white rounded-full pointer-events-none"></div>
        {/* Right Shine */}
        <div
          className="absolute right-[1rem] top-[0.7rem] w-48 h-48 rounded-full border-[8px] border-white pointer-events-none"
          style={{
            clipPath: "ellipse(25% 25% at 70% 30%)",
          }}
        ></div>{" "}
        <div className="absolute right-[1.25rem] top-[6.5em] h-[75%] w-[8.5px] bg-white rounded-full pointer-events-none"></div>
        <div className="absolute right-[6.5rem] top-[.8rem] w-[3rem] h-[7px] bg-white rounded-full pointer-events-none"></div>
        {children}
      </div>

      {/* Fridge Feet */}
      <div className="w-full flex justify-between px-32 -mt-0">
        <div className="w-60 h-20 bg-[#2c2c30] rounded-bl-[40px] rounded-br-[40px]"></div>
        <div className="w-60 h-20 bg-[#2c2c30] rounded-bl-[40px] rounded-br-[40px]"></div>
      </div>
    </div>
  );
}
