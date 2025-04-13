// components/SearchForm.tsx
import React from "react";

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
      <select
        className="h-full px-4 py-2 rounded-md bg-[#d8e1ec] border text-darkblue text-base leading-none"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      >
        <option value="roommate">Roommate</option>
        <option value="places">Housing</option>
      </select>

      <div className="w-[25rem] flex gap-1">
        {searchType === "roommate" ? (
          <>
            <input
              type="text"
              placeholder="Roommate Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch();
                }
              }}
              className="w-1/2 px-4 py-2 border border-darkblue rounded-md"
            />
            <input
              type="text"
              placeholder="Housing Lived At"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch();
                }
              }}
              className="w-1/2 px-4 py-2 border border-darkblue rounded-md"
            />
          </>
        ) : (
          <input
            type="text"
            placeholder="Apartment/Dorm Name"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            className="w-full px-4 py-2 border border-darkblue rounded-md"
          />
        )}
      </div>

      <button
        onClick={onSearch}
        className="bg-darkblue text-white px-6 py-2 rounded-lg font-bold font-lazyDog hover:bg-blue-800 hover:transition"
      >
        GO
      </button>
    </div>
  );
}
