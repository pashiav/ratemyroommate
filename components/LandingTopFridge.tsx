import React from "react";

// Landing page top fridge component with decorative handle and shine effects
export default function LandingTopFridge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Main fridge container with rounded corners and shadow
    <div
      className="bg-[#f5f5f5] rounded-[2rem] md:rounded-[4rem] lg:rounded-[6rem] xl:rounded-[96px] shadow-lg p-4 md:p-6 lg:p-8 min-h-[30rem] md:min-h-[40rem] lg:min-h-[50rem] relative z-0 overflow-hidden"
      style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.2)" }}
    >
      {/* Decorative Fridge Handle - Hidden on mobile, visible on larger screens */}
      <div className="hidden md:block absolute w-auto h-[25rem] lg:h-[30rem] xl:h-[35rem] left-0 ml-8 lg:ml-16 xl:ml-20 top-0 mt-[12rem] lg:mt-[15rem] xl:mt-[10rem]">
        {/* Main handle body with rounded borders */}
        <div className="w-[3rem] lg:w-[4rem] xl:w-[4.75rem] h-full border-r-[1.5rem] lg:border-r-[1.75rem] xl:border-r-[2rem] border-l-[.25rem] lg:border-l-[.4rem] xl:border-l-[.5rem] border-t-[1.5rem] lg:border-t-[2rem] xl:border-t-[2.25rem] border-b-[1.5rem] lg:border-b-[2rem] xl:border-b-[2.25rem] border-darkBlue relative rounded-[1.5rem] lg:rounded-[1.75rem] xl:rounded-[2rem]"></div>
        {/* Handle top with custom clip path */}
        <div
          className="absolute top-0 left-[1.5rem] lg:left-[2rem] xl:left-[2.5rem] w-[3rem] lg:w-[4rem] xl:w-[4.5rem] h-[2.5rem] lg:h-[3.5rem] xl:h-[4rem] bg-darkBlue rounded-rl-[0.25rem] lg:rounded-rl-[0.4rem] xl:rounded-rl-[0.5rem] rounded-tr-[1rem] lg:rounded-tr-[1.25rem] xl:rounded-tr-[1.5rem]"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 85% 100%, 10% 100%)",
          }}
        />
        {/* Handle bottom with custom clip path */}
        <div
          className="absolute bottom-0 left-[1.5rem] lg:left-[2rem] xl:left-[2.5rem] w-[3rem] lg:w-[4rem] xl:w-[4.5rem] h-[2.5rem] lg:h-[3rem] xl:h-[3.5rem] bg-darkBlue rounded-rl-[0.25rem] lg:rounded-rl-[0.4rem] xl:rounded-rl-[0.5rem] rounded-br-[1rem] lg:rounded-br-[1.25rem] xl:rounded-br-[1.5rem]"
          style={{
            clipPath: "polygon(15% 0%, 90% 0%, 100% 100%, 0% 100%)",
          }}
        ></div>
      </div>
      
      {/* Left Side Decorative Shine Effects - Responsive sizing */}
      <div
        className="absolute left-[0.5rem] md:left-[0.75rem] lg:left-[1rem] top-[0.4rem] md:top-[0.6rem] lg:top-[0.7rem] w-24 md:w-32 lg:w-36 xl:w-48 h-24 md:h-32 lg:h-36 xl:h-48 rounded-full border-[4px] md:border-[6px] lg:border-[8px] border-white"
        style={{
          clipPath: "ellipse(25% 25% at 30% 30%)",
        }}
      ></div>
      <div className="absolute left-[0.75rem] md:left-[1rem] lg:left-[1.25rem] top-[4rem] md:top-[5.5rem] lg:top-[6.5em] h-[60%] md:h-[70%] lg:h-[75%] w-[4px] md:w-[6px] lg:w-[8.5px] bg-white rounded-full"></div>
      <div className="absolute left-[3.5rem] md:left-[5rem] lg:left-[6.5rem] top-[0.4rem] md:top-[0.6rem] lg:top-[0.8rem] w-[1.5rem] md:w-[2.25rem] lg:w-[3rem] h-[3.5px] md:h-[5px] lg:h-[7px] bg-white rounded-full"></div>
      
      {/* Right Side Decorative Shine Effects - Responsive sizing */}
      <div
        className="absolute right-[0.5rem] md:right-[0.75rem] lg:right-[1rem] top-[0.4rem] md:top-[0.6rem] lg:top-[0.7rem] w-24 md:w-32 lg:w-36 xl:w-48 h-24 md:h-32 lg:h-36 xl:h-48 rounded-full border-[4px] md:border-[6px] lg:border-[8px] border-white"
        style={{
          clipPath: "ellipse(25% 25% at 70% 30%)",
        }}
      ></div>
      <div className="absolute right-[0.75rem] md:right-[1rem] lg:right-[1.25rem] top-[4rem] md:top-[5.5rem] lg:top-[6.5em] h-[60%] md:h-[70%] lg:h-[75%] w-[4px] md:w-[6px] lg:w-[8.5px] bg-white rounded-full"></div>
      <div className="absolute right-[3.5rem] md:right-[5rem] lg:right-[6.5rem] top-[0.4rem] md:top-[0.6rem] lg:top-[0.8rem] w-[1.5rem] md:w-[2.25rem] lg:w-[3rem] h-[3.5px] md:h-[5px] lg:h-[7px] bg-white rounded-full"></div>
      
      {/* Main content area */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
