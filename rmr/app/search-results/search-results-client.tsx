"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

// Types
interface RoommateViewResult {
  rm_id: string;
  full_name: string;
  housing_name: string | null;
  housing_id: string;
  unit_suffix: string | null;
  avg_rating: number | null;
  recommendation_percentage: number | null;
  review_count: number;
  review_year: number | null;
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
  const [groupedRoommates, setGroupedRoommates] = useState<
    Record<string, RoommateViewResult[]>
  >({});

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
        if (type === "roommate") {
          const grouped = (data as RoommateViewResult[]).reduce(
            (acc, item) => {
              if (!acc[item.full_name]) acc[item.full_name] = [];
              acc[item.full_name].push(item);
              return acc;
            },
            {} as Record<string, RoommateViewResult[]>
          );
          setGroupedRoommates(grouped);
          setResults(data); // still used for fallback and loading check
        } else {
          setResults(data || []);
        }
      } catch (err) {
        console.error("Search failed", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    if (type) fetchResults();
  }, [type, roommateName, location]);

  function isHousing(
    item: RoommateViewResult | HousingViewResult
  ): item is HousingViewResult {
    return "housing_id" in item && "is_verified" in item;
  }

  return (
    <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem]">
      <TopFridge showSearchBar={true}>
        <AuthHeader />

        <div className="flex flex-col items-center mt-[7.5rem] gap-2">
          <h1 className="text-[2.5rem] text-darkBlue text-center leading-none">
            Search Results
          </h1>
          <p className="text-[1rem] text-[#696969] mb-6">
            Showing results for <strong>{type}</strong>
            {type === "roommate" && roommateName && (
              <span className="italic font-sans">: {roommateName}</span>
            )}
            {location && (
              <span className="italic font-sans"> @ {location}</span>
            )}
          </p>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : results.length > 0 ? (
            <ul className="gap-4 w-full max-w-3xl space-y-6">
              {type === "roommate"
                ? Object.entries(groupedRoommates).map(([name, group]) => (
                    <li
                      key={name}
                      className="bg-[#fafafa] p-4 rounded-xl shadow flex flex-col gap-2 border-r-[.35rem] border-b-[.35rem] border-r-[#ebebeb] border-b-[#ebebeb] ml-8"
                    >
                      {/* Name + count header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h2 className="text-[1.75rem]">{name}</h2>
                            {group.length > 1 && (
                              <span className="text-[#8f8f8f] text-sm flex items-center ml-6">
                                <FontAwesomeIcon icon={faUserFriends} />
                                <span className="ml-2">
                                  {group.length} profiles found with this name
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* List of housing/unit combos */}
                      {group.map((item) => (
                        <div
                          key={item.rm_id + item.unit_suffix}
                          className="grid grid-cols-[1fr_1fr_auto]"
                        >
                          {/* Left: Housing, Unit, Year */}
                          <div>
                            <p className="text-gray-700 text-sm">
                              <span className="underline">
                                <FontAwesomeIcon icon={faLocationDot} />{" "}
                                {item.housing_name ?? "Unknown housing"}
                              </span>{" "}
                              · Unit #...{item.unit_suffix ?? "?"} ·{" "}
                              {item.review_year ?? "N/A"}
                            </p>
                          </div>

                          {/* Middle: Stars */}
                          <div className="flex justify-center min-w-[160px] whitespace-nowrap">
                            {item.avg_rating !== null ? (
                              <div className="flex items-center text-sm">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= Math.round(item.avg_rating ?? 0)
                                          ? "text-[gold]"
                                          : "text-gray-300"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="ml-2 text-xs text-gray-700 ">
                                  {item.avg_rating.toFixed(2)}{" "}
                                  <a
                                    href="#"
                                    className="underline text-[0.7rem]"
                                  >
                                    ({item.review_count}{" "}
                                    {item.review_count === 1
                                      ? "review"
                                      : "reviews"}
                                    )
                                  </a>
                                </span>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No reviews
                              </p>
                            )}
                          </div>

                          {/* Right: Button */}
                          <div className="flex justify-end">
                            <Link
                              href={`/roommate/${item.rm_id}?housing_id=${item.housing_id}&unit_suffix=${item.unit_suffix}`}
                              className="px-2 py-[0.2rem] bg-lightBlue text-white rounded-md hover:bg-blue-900 text-sm whitespace-nowrap"
                            >
                              VIEW PROFILE
                            </Link>
                          </div>
                        </div>
                      ))}
                    </li>
                  ))
                : results.filter(isHousing).map((item) => (
                    <li
                      key={item.housing_id}
                      className="bg-[#fafafa] p-4 rounded-xl shadow flex flex-col gap-2 border-r-[.35rem] border-b-[.35rem] border-r-[#ebebeb] border-b-[#ebebeb] ml-8"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-semibold">
                            {item.housing_name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {item.school_name}
                          </p>
                        </div>
                        {item.is_verified && (
                          <span className="text-green-600 text-sm font-semibold whitespace-nowrap">
                            ✔ Verified
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
            </ul>
          ) : (
            <div className="mt-6">
              <p className="text-gray-500 mb-4">No results found.</p>
              <Link
                href={type === "roommate" ? "/roommate/new" : "/housing/new"}
                className="inline-block bg-navy-blue text-lazyDog text-white px-6 py-2 rounded-md bg-darkBlue hover:bg-blue-800 hover:transition"
              >
                Add a new {type === "roommate" ? "roommate" : "housing"}
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
