import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Props interface for the search form component
type Props = {
  searchType: string;
  searchQuery: string;
  locationQuery: string;
  setSearchType: (value: string) => void;
  setSearchQuery: (value: string) => void;
  setLocationQuery: (value: string) => void;
  onSearch: () => void;
};

// Search form component with roommate and housing search options
export default function SearchForm({
  searchType,
  searchQuery,
  locationQuery,
  setSearchType,
  setSearchQuery,
  setLocationQuery,
  onSearch,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-1 h-full w-full">
      {/* Search Type Selector */}
      <div className="relative inline-block min-w-fit w-full sm:w-auto">
        <select
          className="h-10 px-4 pr-10 text-center rounded-md bg-[#d8e1ec] border text-darkBlue text-xs xs:text-sm sm:text-base leading-tight appearance-none w-full sm:w-auto"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="roommate">Roommate</option>
          <option value="housing">Housing</option>
        </select>
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 flex items-center">
          <svg
            className="w-4 h-4 text-darkBlue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Search Input Fields */}
      <div className="w-full sm:w-[25rem] h-auto sm:h-[2.4rem] flex flex-col sm:flex-row gap-2 sm:gap-1 italic font-sans text-[0.625rem] xs:text-[0.75rem] sm:text-sm bg-transparent">
        {searchType === "roommate" ? (
          <>
            {/* Roommate name input field */}
            <div className="w-full sm:w-[25rem] h-auto sm:h-[2.4rem] flex flex-col sm:flex-row gap-2 sm:gap-1">

            <input
              type="text"
              placeholder="Roommate Name"
              value={searchQuery}
              onChange={(e) => {
                // Sanitize input to remove numbers and semicolons
                const sanitized = e.target.value.replace(/[0-9;]/g, "");
                setSearchQuery(sanitized);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch();
                }
              }}
              className="w-[75vw] sm:w-1/2 px-4 py-2 border border-darkBlue rounded-md italic font-sans text-[0.625rem] xs:text-xs sm:text-sm"
            />
            {/* Location input field for roommate search */}
            <input
              type="text"
              placeholder="Apartment/Dorm Name"
              value={locationQuery}
              onChange={(e) => {
                // Sanitize input to remove numbers and semicolons
                const sanitized = e.target.value.replace(/[0-9;]/g, "");
                setLocationQuery(sanitized);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch();
                }
              }}
              className="w-[75vw] sm:w-1/2 px-4 py-2 border border-darkBlue rounded-md italic font-sans text-[0.625rem] xs:text-xs sm:text-sm"
            />
            </div>
          </>

        ) : (
          /* Single location input field for housing search */
          <input
            type="text"
            placeholder="Apartment/Dorm Name"
            value={locationQuery}
            onChange={(e) => {
              // Sanitize input to remove numbers and semicolons
              const sanitized = e.target.value.replace(/[0-9;]/g, "");
              setLocationQuery(sanitized);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            className="w-[75vw] sm:w-full px-4 py-2 border border-darkBlue rounded-md italic font-sans text-[0.625rem] xs:text-sm sm:text-base"
          />
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={onSearch}
        className="bg-darkBlue text-white w-full sm:w-[2.4rem] h-10 sm:h-[2.4rem] rounded-md hover:bg-blue-900 flex items-center justify-center transition"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
      </button>
    </div>
  );
}
