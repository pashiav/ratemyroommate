import React from "react";

export default function LandingTopFridge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // add the top part of the fridge, the shine on the left and right, the handle, and the content in the middle
    <div
      className="bg-[#f5f5f5] rounded-[96px] shadow-lg p-8 min-h-[50rem] pointer-events-none relative z-0 overflow-hidden"
      style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.2)" }}
    >
      {/* Handle */}
      <div className="absolute w-auto h-[45rem] left-0 ml-24 top-0 mt-20">
        {/* Main handle body */}
        <div className="w-[5.5rem] h-full border-r-[2rem] border-l-[.75rem] border-t-[2.25rem] border-b-[2.25rem] border-darkBlue relative rounded-[2rem]"></div>
        {/* Handle top */}
        <div
          className="absolute top-0 left-[5.75rem] transform -translate-x-1/2 w-[3.5rem] h-[4rem] bg-darkBlue"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 85% 100%, 10% 100%)",
          }}
        />
        {/* Handle bottom */}
        <div
          className="absolute bottom-0 left-[5.75rem] transform -translate-x-1/2 w-[3.5rem] h-[3.5rem] bg-darkBlue rounded-rl-[0.5rem] rounded-br-[1.5rem]"
          style={{
            clipPath: "polygon(15% 0%, 90% 0%, 100% 100%, 0% 100%)",
          }}
        ></div>
      </div>
      <img
        src="/handle-short.png"
        alt="Fridge Handle"
        className="absolute left-0 ml-24 top-0 mt-40 w-36 h-auto object-contain z-10"
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
  );
}
