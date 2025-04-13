"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import SearchForm from "@/components/SearchForm";

export default function SearchBar() {
  const [searchType, setSearchType] = useState("roommate");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const { isSignedIn } = useUser();
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
        if (query) queryParams.append("roommateName", query);
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
    <SearchForm
      searchType={searchType}
      searchQuery={searchQuery}
      locationQuery={locationQuery}
      setSearchType={setSearchType}
      setSearchQuery={setSearchQuery}
      setLocationQuery={setLocationQuery}
      onSearch={handleSearch}
    />
  );
}
