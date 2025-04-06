"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [searchType, setSearchType] = useState("roommate");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const { isSignedIn } = useUser(); // Use Clerk's useUser to check if the user is signed in
  const router = useRouter();

  const handleSearch = async () => {
    const query = searchQuery.trim();
    const location = locationQuery.trim();

    if (searchType === "roommate" && !query && !location) return;
    if (searchType === "place" && !location) return;

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchType,
          roommateName: searchType === "roommate" ? query : undefined,
          location: searchType === "place" ? location : location || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Search failed:", err);
        return;
      }

      const queryParams = new URLSearchParams();
      queryParams.append("type", searchType);
      if (searchType === "roommate") {
        if (query) queryParams.append("roommateName", query); // FIXED HERE
        if (location) queryParams.append("location", location);
      } else {
        queryParams.append("location", location);
      }

      router.push(`/search-results?${queryParams.toString()}`);
    } catch (err) {
      console.error("Error hitting search API:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#315d8d] pl-4 pr-4">
      <div className="bg-[#f5f5f5] rounded-[96px] shadow-lg p-8 min-h-screen">
        {/* Fridge handle */}
        <img
          src="/handle.png"
          alt="Fridge Handle"
          className="absolute left-0 ml-24 top-[7.5rem] w-36 h-auto object-contain"
        />

        {/* shineeeee left */}
        <img
          src="/shine-left-crop.png"
          alt="shine"
          className="absolute left-0 top-0 mt-1 ml-6 w-xs h-auto object-cover"
        />
        {/* shineeeee right */}
        <img
          src="/shine-right-crop.png"
          alt="shine"
          className="absolute right-0 top-0 mt-1 mr-6 w-xs h-auto object-cover"
        />

        <div className="absolute top-20 right-28 z-50">
          {isSignedIn ? (
            <UserButton /> // Clerk's UserButton will display the user's profile
          ) : (
            <SignInButton mode="modal">
              <button className="bg-navy-blue text-white px-4 py-2 rounded-full hover:bg-navy-blue/90 ml-90">
                Log In
              </button>
            </SignInButton>
          )}
        </div>

        {/* Search Form Inline */}
        <div className="flex flex-col items-center gap-6 mt-[13rem]">
          {/* Heading */}
          <h1 className="text-[10rem] font-lazyDog text-darkblue text-center leading-none">
            Search
          </h1>
          <p className="text-lg text-darkblue italic text-center -mt-7">
            Search for a roommate or housing.
          </p>

          {/* Inline Form */}
          <div className="flex flex-col sm:flex-row gap-2 w-64 max-w-5xl justify-center mt-5">
            {/* Select */}
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-4 py-2 rounded-md bg-[#d8e1ec] border font-lazyDog text-darkblue"
            >
              <option value="roommate">Roommate</option>
              <option value="place">Apartment/Dorm</option>
            </select>

            {/* Roommate-specific inputs */}
            {searchType === "roommate" ? (
              <>
                <input
                  type="text"
                  placeholder="Roommate Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-darkblue rounded-md"
                />
                <input
                  type="text"
                  placeholder="Where They Lived"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-darkblue rounded-md"
                />
              </>
            ) : (
              <input
                type="text"
                placeholder="Search for apartment"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-darkblue rounded-md"
              />
            )}

            {/* GO Button */}
            <button
              onClick={handleSearch}
              className="bg-darkblue text-white px-6 py-2 rounded-lg font-bold font-lazyDog"
            >
              GO
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
