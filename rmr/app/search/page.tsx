"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const [searchType, setSearchType] = useState("roommate");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: searchType, query: searchQuery }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/search-results?type=${searchType}&query=${encodeURIComponent(searchQuery)}`);
      } else {
        console.error("Search failed");
      }
    } catch (err) {
      console.error("Error hitting search API:", err);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Search</h1>
        <p className="text-lg text-gray-600 mb-6">
          Find a {searchType === "roommate" ? "roommate by name" : "place by apartment/dorm name"}.
        </p>

        {/* Pick List */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Type</label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="roommate">Roommate</option>
            <option value="place">Apartment/Dorm</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Search for ${searchType === "roommate" ? "roommate" : "apartment"}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>
    </main>
  );
}
