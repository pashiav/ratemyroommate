import React from "react";

export default function BottomFridge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div
        className="bg-lightGray rounded-[96px] mt-0 shadow-lg p-10 min-h-[55rem] w-[100%] mx-auto relative"
        style={{ boxShadow: "0 -4px 4px -2px rgba(0, 0, 0, 0.2)" }}
      >
        <img
          src="/handle-short.png"
          alt="Fridge Handle"
          className="absolute left-0 ml-24 top-0 mt-24 w-36 h-auto object-contain z-0"
        />
        <img
          src="/shine-left.png"
          alt="shine"
          className="absolute left-0 top-0 mt-1 ml-1 w-xs h-auto object-contain z-0"
        />
        <img
          src="/shine-right.png"
          alt="shine"
          className="absolute right-0 top-0 mt-1 mr-1 w-xs h-auto object-contain z-0"
        />

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
