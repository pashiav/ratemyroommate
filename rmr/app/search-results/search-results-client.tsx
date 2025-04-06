"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

// Types
interface Review {
  rating: number;
  would_recommend: boolean;
  has_pets: boolean;
  pet_friendly: boolean;
  years_lived: number;
  comments: string;
}

interface Place {
  name: string;
  school?: string;
}

interface Roommate {
  rm_id: string;
  name: string;
  unit_end: number;
  places?: Place;
  reviews?: Review[];
}

interface PlaceResult {
  places_id: string;
  name: string;
  school?: string;
  roommates?: { count: number };
}

type SearchResult = Roommate | PlaceResult;

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const roommateName = searchParams.get("roommateName");
  const location = searchParams.get("location");
  const type = searchParams.get("type");

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchType: type, roommateName, location }),
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

    if (type) fetchResults();
  }, [type, roommateName, location]);

  const calculateAverageRating = (reviews: Review[] | undefined): number => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length;
  };

  const calculateRecommendPercentage = (reviews: Review[] | undefined): number => {
    if (!reviews || reviews.length === 0) return 0;
    const recommendCount = reviews.filter((r) => r.would_recommend).length;
    return Math.round((recommendCount / reviews.length) * 100);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
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
          Showing results for <strong>{type}</strong>
          {type === "roommate" && roommateName && `: ${roommateName}`}
          {location && ` @ ${location}`}
        </p>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((item, i) => (
              <li key={i} className="bg-gray-100 rounded-md shadow-sm overflow-hidden">
                {type === "roommate" && "unit_end" in item && (
                  <Link href={`/roommate/${item.rm_id}`} className="block p-4 hover:bg-gray-200 transition-colors">
                    <div className="text-left">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Unit {item.unit_end}</p>
                      {item.places && (
                        <p className="text-sm text-gray-500">
                          {item.places.name}
                          {item.places.school && ` - ${item.places.school}`}
                        </p>
                      )}

                      <div className="mt-2 pt-2 border-t border-gray-200">
                        {item.reviews && item.reviews.length > 0 ? (
                          <>
                            <div className="flex items-center">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const avgRating = calculateAverageRating(item.reviews);
                                  return (
                                    <svg
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  );
                                })}
                              </div>
                              <span className="ml-2 text-sm font-medium text-gray-700">
                                {calculateAverageRating(item.reviews).toFixed(1)}
                                <span className="ml-1 text-xs text-gray-500">
                                  ({item.reviews.length} review{item.reviews.length !== 1 ? "s" : ""})
                                </span>
                              </span>
                            </div>

                            <div className="text-xs text-gray-700 mt-1">
                              {calculateRecommendPercentage(item.reviews)}% would recommend
                            </div>

                            {item.reviews.some((r) => r.has_pets) && (
                              <div className="text-xs text-gray-700 mt-1">
                                Has pets{item.reviews.some((r) => r.pet_friendly) ? " • Pet friendly" : ""}
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-gray-500">No reviews yet</p>
                        )}
                      </div>
                    </div>
                  </Link>
                )}

                {type === "place" && "places_id" in item && (
                  <div className="p-4 text-left">
                    <p className="font-semibold">{item.name}</p>
                    {item.school && <p className="text-sm text-gray-500">{item.school}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      {item.roommates?.count || 0} roommate
                      {(item.roommates?.count || 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
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

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center text-navy-blue hover:underline">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </Link>
        </div>
      </div>
    </main>
  );
}
