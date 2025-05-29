import React from "react";
import SearchBar from "./SearchBar";

interface Props {
  children: React.ReactNode;
  showSearchBar?: boolean;
}

export default function TopFridge({ children, showSearchBar = true }: Props) {
  return (
    // add the top part of the fridge, the shine on the left and right, the handle, and the content in the middle
    <div
      className="bg-[#f5f5f5] rounded-[96px] shadow-lg p-8 min-h-[50rem] relative z-0 overflow-hidden"
      style={{ boxShadow: "0 4px 4px -2px rgba(0, 0, 0, 0.2)" }}
    >
      {/* Handle */}
      <div className="absolute w-auto h-[35rem] left-0 ml-20 top-0 mt-[10rem]">
        {/* Main handle body */}
        <div className="w-[4.75rem] h-full border-r-[2rem] border-l-[.5rem] border-t-[2.25rem] border-b-[2.25rem] border-darkBlue relative rounded-[2rem]"></div>
        {/* Handle top */}
        <div
          className="absolute top-0 left-[2.5rem] w-[4.5rem] h-[4rem] bg-darkBlue rounded-rl-[0.5rem] rounded-tr-[1.5rem]"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 85% 100%, 10% 100%)",
          }}
        />
        {/* Handle bottom */}
        <div
          className="absolute bottom-0 left-[2.5rem] w-[4.5rem] h-[3.5rem] bg-darkBlue rounded-rl-[0.5rem] rounded-br-[1.5rem]"
          style={{
            clipPath: "polygon(15% 0%, 90% 0%, 100% 100%, 0% 100%)",
          }}
        ></div>
      </div>
      {/* Left Shine */}
      <div
        className="absolute left-[1rem] top-[0.7rem] w-48 h-48 rounded-full border-[8px] border-white"
        style={{
          clipPath: "ellipse(25% 25% at 30% 30%)",
        }}
      ></div>{" "}
      <div className="absolute left-[1.25rem] top-[6.5em] h-[75%] w-[8.5px] bg-white rounded-full"></div>
      <div className="absolute left-[6.5rem] top-[.8rem] w-[3rem] h-[7px] bg-white rounded-full"></div>
      {/* Right Shine */}
      <div
        className="absolute right-[1rem] top-[0.7rem] w-48 h-48 rounded-full border-[8px] border-white"
        style={{
          clipPath: "ellipse(25% 25% at 70% 30%)",
        }}
      ></div>{" "}
      <div className="absolute right-[1.25rem] top-[6.5em] h-[75%] w-[8.5px] bg-white rounded-full"></div>
      <div className="absolute right-[6.5rem] top-[.8rem] w-[3rem] h-[7px] bg-white rounded-full"></div>
      {children}
      {/* Logo in left corner */}
      <a href="/">
        <div className="absolute top-0 left-0 mt-[2.5rem] ml-[5rem] w-[6.75rem] h-auto z-20">
          <img src="/logo.png" alt="Logo" />
        </div>
      </a>
      {/* Only show the search bar if showSearchBar is true */}
      {showSearchBar && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-[3rem] z-50">
          <SearchBar />
        </div>
      )}
    </div>
  );
}
