"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";

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
    return (
      reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
      reviews.length
    );
  };

  const calculateRecommendPercentage = (
    reviews: Review[] | undefined
  ): number => {
    if (!reviews || reviews.length === 0) return 0;
    const recommendCount = reviews.filter((r) => r.would_recommend).length;
    return Math.round((recommendCount / reviews.length) * 100);
  };

  return (
    <main className="min-h-screen bg-[#315d8d] pl-4 pr-4">
      <TopFridge>
        <AuthHeader />

        <div className="flex flex-col items-center gap-6 mt-[12rem]">
          <h1 className="text-[5rem] text-darkblue text-center leading-none">
            Search Results
          </h1>
          <p className="text-lg text-darkBlue text-sans mb-6">
            Showing results for <strong>{type}</strong>
            {type === "roommate" && roommateName && `: ${roommateName}`}
            {location && ` @ ${location}`}
          </p>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : results.length > 0 ? (
            <ul className="gap-4 w-[40rem] space-y-3">
              {results.map((item, i) => (
                <li
                  key={i}
                  className="bg-gray-100 rounded-md shadow-sm overflow-hidden"
                >
                  {type === "roommate" && "unit_end" in item && (
                    <Link
                      href={`/roommate/${item.rm_id}`}
                      className="block p-4 hover:bg-gray-200 transition-colors"
                    >
                      {/* Horizontal layout for roommate info and review info */}
                      <div className="flex flex-col sm:flex-row justify-between gap-6 text-left">
                        {/* Left side: roommate and place info */}
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Unit {item.unit_end}
                          </p>
                          {item.places && (
                            <p className="text-sm text-gray-500">
                              {item.places.name}
                              {item.places.school && ` - ${item.places.school}`}
                            </p>
                          )}
                        </div>

                        {/* Right side: review stats */}
                        <div className="w-full sm:w-48">
                          {item.reviews && item.reviews.length > 0 ? (
                            <>
                              {/* Star rating */}
                              <div className="flex items-center">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    const avgRating = calculateAverageRating(
                                      item.reviews
                                    );
                                    return (
                                      <svg
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= Math.round(avgRating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
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
                                  {calculateAverageRating(item.reviews).toFixed(
                                    1
                                  )}
                                  <span className="ml-1 text-xs text-gray-500">
                                    ({item.reviews.length} review
                                    {item.reviews.length !== 1 ? "s" : ""})
                                  </span>
                                </span>
                              </div>

                              {/* Recommendation percentage */}
                              <div className="text-xs text-gray-700 mt-1">
                                {calculateRecommendPercentage(item.reviews)}%
                                would recommend
                              </div>

                              {/* Pet information */}
                              {item.reviews.some((r) => r.has_pets) && (
                                <div className="text-xs text-gray-700 mt-1">
                                  Has pets
                                  {item.reviews.some((r) => r.pet_friendly)
                                    ? " • Pet friendly"
                                    : ""}
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-gray-500">
                              No reviews yet
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  )}

                  {type === "places" && "places_id" in item && (
                    <Link
                      href={`/place/${item.places_id}`}
                      className="block p-4 text-left hover:bg-gray-200 transition-colors"
                    >
                      <p className="font-semibold">{item.name}</p>
                      {item.school && (
                        <p className="text-sm text-gray-500">{item.school}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {item.roommates?.count || 0} roommate
                        {(item.roommates?.count || 0) !== 1 ? "s" : ""}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6">
              <p className="text-gray-500 mb-4">No results found.</p>
              <Link
                href={type === "roommate" ? "/roommate/new" : "/place/new"}
                className="inline-block bg-navy-blue text-lazyDog text-white px-6 py-2 rounded-md bg-darkblue hover:bg-blue-800 hover:transition"
              >
                Add a new {type === "roommate" ? "roommate" : "place"}
              </Link>
            </div>
          )}

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center text-navy-blue hover:underline"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Search
            </Link>
          </div>
        </div>
      </TopFridge>
    </main>
  );
}
