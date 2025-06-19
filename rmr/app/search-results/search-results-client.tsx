"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";

// Types
interface RoommateViewResult {
  rm_id: string;
  full_name: string;
  housing_name: string | null;
  unit_suffix: string | null;
  avg_rating: number | null;
  recommendation_percentage: number | null;
}

interface HousingViewResult {
  housing_id: string;
  housing_name: string;
  school_name: string;
  is_verified: boolean;
  latitude?: number;
  longitude?: number;
}

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const roommateName = searchParams.get("roommateName");
  const location = searchParams.get("location");
  const type = searchParams.get("type");

  const [results, setResults] = useState<
    (RoommateViewResult | HousingViewResult)[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();

  useEffect(() => {
    async function fetchResults() {
      try {
        const queryParams = new URLSearchParams();
        if (type) queryParams.append("type", type);
        if (roommateName) queryParams.append("roommateName", roommateName);
        if (location) queryParams.append("location", location);

        const res = await fetch(`/api/search?${queryParams.toString()}`);
        const data = await res.json();
        console.table("API returned:", data);
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

  return (
    <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem]">
      <TopFridge showSearchBar={true}>
        <AuthHeader />

        <div className="flex flex-col items-center gap-3 mt-[9rem]">
          <h1 className="text-[3rem] text-darkBlue text-center leading-none">
            Search Results
          </h1>
          <p className="text-lg text-gray-500 mb-6">
            Showing results for <strong>{type}</strong>
            {type === "roommate" && roommateName && (
              <span className="italic font-sans font-bold">
                : {roommateName}
              </span>
            )}
            {location && (
              <span className="italic font-sans font-bold"> @ {location}</span>
            )}
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
                  {type === "roommate" && (
                    <Link
                      href={`/roommate/${item.rm_id}`}
                      className="block p-4 hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-6 text-left">
                        {/* Left side */}
                        <div className="flex-1">
                          <p className="font-semibold text-lg">
                            {item.full_name}
                          </p>
                          {item.avg_rating !== null && (
                            <>
                              <p className="text-sm text-gray-700 font-sans font-bold italic">
                                Most recent review:
                              </p>
                              {item.housing_name && (
                                <p className="text-sm text-gray-500">
                                  <span className="font-sans font-bold italic">
                                    Housing:
                                  </span>{" "}
                                  {item.housing_name}
                                </p>
                              )}
                              {item.unit_suffix && (
                                <p className="text-sm text-gray-500">
                                  <span className="font-sans font-bold italic">
                                    Unit end:
                                  </span>{" "}
                                  {item.unit_suffix}
                                </p>
                              )}
                            </>
                          )}
                        </div>

                        {/* Right side */}
                        <div className="w-full sm:w-48">
                          {item.avg_rating !== null ? (
                            <>
                              <div className="flex items-center">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= Math.round(item.avg_rating ?? 0)
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">
                                  {item.avg_rating?.toFixed(1)}
                                </span>
                              </div>

                              <div className="text-xs text-gray-700 mt-1">
                                {item.recommendation_percentage ?? 0}% would
                                recommend
                              </div>
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
                  {type === "housing" && (
                    <Link
                      href={`/place/${item.housing_id}`}
                      className="block p-4 hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-6 text-left">
                        {/* Left side */}
                        <div className="flex-1">
                          <p className="font-semibold text-lg">
                            {item.housing_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.school_name}
                          </p>
                        </div>

                        {/* Right side */}
                        <div className="w-full sm:w-48">
                          {item.is_verified ? (
                            <span className="text-green-600 font-bold">
                              Verified
                            </span>
                          ) : (
                            <span className="text-red-600 font-bold">
                              Not Verified
                            </span>
                          )}
                        </div>
                      </div>
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
                className="inline-block bg-navy-blue text-lazyDog text-white px-6 py-2 rounded-md bg-darkBlue hover:bg-blue-800 hover:transition"
              >
                Add a new {type === "roommate" ? "roommate" : "place"}
              </Link>
            </div>
          )}

          <div className="mt-8">
            <Link
              href="/search"
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
