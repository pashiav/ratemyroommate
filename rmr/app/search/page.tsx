"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";
import SearchForm from "@/components/SearchForm";

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
    if (searchType === "places" && !location) return;

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchType,
          roommateName: searchType === "roommate" ? query : undefined,
          location: searchType === "places" ? location : location || undefined,
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
      <TopFridge>
        <AuthHeader></AuthHeader>
        <div className="absolute top-0 left-0 mt-[3.5em] ml-[6rem] w-[7rem] h-auto z-50">
          <img src="logo.png" alt="Logo"/>
          </div>

        {/* Search Form Inline */}
        <div className="flex flex-col items-center gap-6 mt-[13rem] font-lazyDog">
          {/* Heading */}
          <h1 className="text-[9rem] font-lazyDog text-darkblue text-center leading-none">
            Search
          </h1>
          <p className="text-lg text-darkblue italic text-center -mt-7">
            Search for a roommate or housing.
          </p>

          <SearchForm
            searchType={searchType}
            searchQuery={searchQuery}
            locationQuery={locationQuery}
            setSearchType={setSearchType}
            setSearchQuery={setSearchQuery}
            setLocationQuery={setLocationQuery}
            onSearch={handleSearch}
          />
        </div>
      </TopFridge>
    </main>
  );
}
