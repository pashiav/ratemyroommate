import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

type Props = {
  searchType: string;
  searchQuery: string;
  locationQuery: string;
  setSearchType: (value: string) => void;
  setSearchQuery: (value: string) => void;
  setLocationQuery: (value: string) => void;
  onSearch: () => void;
};

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
    <div className="flex items-center gap-1 h-full">
      <div className="relative inline-block min-w-fit">
        {" "}
        <select
          className="h-10 px-4 pr-10 text-center rounded-md bg-[#d8e1ec] border text-darkBlue text-base leading-tight appearance-none"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="roommate">Roommate</option>
          <option value="housing">Housing</option>
        </select>
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

      <div className="w-[25rem] h-[2.4rem] flex gap-1 italic font-sans text-[0.75rem] bg-transparent">
        {searchType === "roommate" ? (
          <>
            <input
              type="text"
              placeholder="Roommate Name"
              value={searchQuery}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[0-9;]/g, "");
                setSearchQuery(sanitized);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch();
                }
              }}
              className="w-1/2 px-4 py-2 border border-darkBlue rounded-md italic font-sans"
            />
            <input
              type="text"
              placeholder="Housing Name Lived At"
              value={locationQuery}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[0-9;]/g, "");
                setLocationQuery(sanitized);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch();
                }
              }}
              className="w-1/2 px-4 py-2 border border-darkBlue rounded-md italic font-sans"
            />
          </>
        ) : (
          <input
            type="text"
            placeholder="Housing Name Lived At"
            value={locationQuery}
            onChange={(e) => {
              const sanitized = e.target.value.replace(/[0-9;]/g, "");
              setLocationQuery(sanitized);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            className="w-full px-4 py-2 border border-darkBlue rounded-md italic font-sans"
          />
        )}
      </div>

      <button
        onClick={onSearch}
        className="bg-darkBlue text-white w-[2.4rem] h-[2.4rem] rounded-md hover:bg-blue-900 flex items-center justify-center transition"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
      </button>
    </div>
  );
}
