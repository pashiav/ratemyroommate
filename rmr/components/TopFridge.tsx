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
      <img
        src="/handle-short.png"
        alt="Fridge Handle"
        className="absolute left-0 ml-24 top-0 mt-40 w-36 h-auto object-contain z-10"
      />
      <img
        src="/shine-left-crop.png"
        alt="shine"
        className="absolute left-0 top-0 mt-1 ml-1 w-xs h-auto object-contain z-10"
      />
      <img
        src="/shine-right-crop.png"
        alt="shine"
        className="absolute right-0 top-0 mt-1 mr-1 w-xs h-auto object-contain z-10"
      />
      {children}

      {/* Logo in left corner */}
      <div className="absolute top-0 left-0 mt-[2.5rem] ml-[6rem] w-[7rem] h-auto z-50">
        <img src="/logo.png" alt="Logo" />
      </div>

      {/* Only show the search bar if showSearchBar is true */}
      {showSearchBar && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-[3rem] z-50">
          <SearchBar />
        </div>
      )}
    </div>
  );
}
