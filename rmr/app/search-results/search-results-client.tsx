"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const type = searchParams.get("type");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { isSignedIn } = useUser();

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchQuery: query, searchType: type }),
        });

        const data = await res.json();
        setResults(data || []);
      } catch (err) {
        console.error("Search failed", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    if (query && type) fetchResults();
  }, [query, type]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      {/* Clerk Profile Button or Sign In Button */}
      <div className="absolute top-4 right-4">
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="bg-navy-blue text-white px-4 py-2 rounded-full hover:bg-navy-blue/90">
              Log In
            </button>
          </SignInButton>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Search Results</h1>
        <p className="text-lg text-gray-600 mb-6">
          Showing results for <strong>{query}</strong> in <strong>{type}</strong>
        </p>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((item: any, i: number) => (
              <li key={i} className="bg-gray-100 rounded-md p-4 text-left shadow-sm">
                <p className="font-semibold">{type === "roommate" ? item.name : item.name}</p>
                {type === "roommate" && (
                  <p className="text-sm text-gray-500">Unit {item.unit_end}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6">
            <p className="text-gray-500 mb-4">No results found.</p>
            <Link
              href={type === "roommate" ? "/roommate/new" : "/place/new"}
              className="inline-block bg-navy-blue text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Add a new {type}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}