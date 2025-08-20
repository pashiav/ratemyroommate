"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import SearchForm from "@/components/SearchForm";

// Search bar component that manages search state and navigation
export default function SearchBar() {
  // State management for search parameters
  const [searchType, setSearchType] = useState("roommate");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const { isSignedIn } = useUser();
  const router = useRouter();

  // Handle search submission and navigation
  const handleSearch = async () => {
    const query = searchQuery.trim();
    const location = locationQuery.trim();

    // Validate search parameters based on type
    if (searchType === "roommate" && !query && !location) return;
    if (searchType === "housing" && !location) return;

    try {
      // Build query parameters for search results page
      const queryParams = new URLSearchParams();
      queryParams.append("type", searchType);
      if (searchType === "roommate") {
        if (query) queryParams.append("roommateName", query);
        if (location) queryParams.append("location", location);
      } else {
        queryParams.append("location", location);
      }

      // Navigate to search results page with parameters
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
