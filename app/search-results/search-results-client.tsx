"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import TopFridge from "@/components/TopFridge";
import BottomFridge from "@/components/BottomFridge";
import Footer from "@/components/Footer";
import AuthHeader from "@/components/AuthHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

// Type definitions for search result data structures
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
  // Extract search parameters from URL
  const roommateName = searchParams.get("roommateName");
  const location = searchParams.get("location");
  const type = searchParams.get("type");

  // State management for search results and UI
  const [results, setResults] = useState<
    (RoommateViewResult | HousingViewResult)[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();
  // Group roommates by name for better organization
  const [groupedRoommates, setGroupedRoommates] = useState<
    Record<string, RoommateViewResult[]>
  >({});

  // Fetch search results from API based on search parameters
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
          // Group roommate results by name for better display
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

  // Type guard to distinguish between roommate and housing results
  function isHousing(
    item: RoommateViewResult | HousingViewResult
  ): item is HousingViewResult {
    return "housing_id" in item && "is_verified" in item;
  }

  // Split results into top (first 2) and bottom (rest)
  const topResultsCount = 2;
  const topGroupedRoommates = type === "roommate" 
    ? Object.fromEntries(Object.entries(groupedRoommates).slice(0, topResultsCount))
    : {};
  const bottomGroupedRoommates = type === "roommate"
    ? Object.fromEntries(Object.entries(groupedRoommates).slice(topResultsCount))
    : {};
  const topHousingResults = type === "housing" ? results.filter(isHousing).slice(0, topResultsCount) : [];
  const bottomHousingResults = type === "housing" ? results.filter(isHousing).slice(topResultsCount) : [];

  // Render a roommate result item
  const renderRoommateItem = (name: string, group: RoommateViewResult[]) => {
    const hasNoReviews = group.length === 1 && group[0].review_count === 0;

    return (
      <li
        key={name}
        className="bg-[#fafafa] p-3 sm:p-4 rounded-xl shadow flex flex-col gap-2 border-r-[.35rem] border-b-[.35rem] border-r-[#ebebeb] border-b-[#ebebeb]"
      >
        {/* Mobile-first layout for roommate header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Left column: Name and profile count */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] font-semibold break-words">
              {name}
            </h2>

            {group.length > 1 && (
              <div className="flex items-center mt-2 text-[#8f8f8f] text-sm">
                <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
                <span>
                  {group.length} profiles found with this name
                </span>
              </div>
            )}
          </div>

          {/* Right column - VIEW PROFILE button for single profiles */}
          <div className="flex justify-start sm:justify-end">
            {group.length === 1 &&
              group[0].review_count !== 1 && (
                <Link
                  href={`/roommate/${group[0].rm_id}?housing_id=${group[0].housing_id}&unit_suffix=${group[0].unit_suffix}`}
                  className="px-3 py-2 bg-lightBlue text-white rounded-md hover:bg-blue-900 text-sm whitespace-nowrap transition-colors"
                >
                  VIEW PROFILE
                </Link>
              )}
          </div>
        </div>

        {/* Review details for each roommate profile */}
        {!hasNoReviews &&
          group.map((item) => (
            <div
              key={item.rm_id + item.unit_suffix}
              className="border-t border-gray-200 pt-3 mt-2"
            >
              {/* Mobile-first layout for review details */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Location and unit information */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <span className="underline">
                      <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                      {item.housing_name ?? "N/A"}
                    </span>{" "}
                    · Unit #...{item.unit_suffix ?? "?"} ·{" "}
                    {item.review_year ?? "N/A"}
                  </p>
                </div>

                {/* Rating display with star icons */}
                <div className="flex justify-start sm:justify-center min-w-[140px] sm:min-w-[160px]">
                  {item.avg_rating !== null ? (
                    <div className="flex items-center text-sm">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <=
                              Math.round(item.avg_rating ?? 0)
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
                      <span className="ml-2 text-xs text-gray-700">
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
                      No reviews yet
                    </p>
                  )}
                </div>

                {/* View Profile button for each review */}
                <div className="flex justify-start sm:justify-end">
                  <Link
                    href={`/roommate/${item.rm_id}?housing_id=${item.housing_id}&unit_suffix=${item.unit_suffix}`}
                    className="px-3 py-2 bg-lightBlue text-white rounded-md hover:bg-blue-900 text-sm whitespace-nowrap transition-colors"
                  >
                    VIEW PROFILE
                  </Link>
                </div>
              </div>
            </div>
          ))}

        {/* Show "No reviews yet" message for profiles without reviews */}
        {hasNoReviews && (
          <div className="border-t border-gray-200 pt-3 mt-2">
            <p className="text-sm text-gray-500 text-center">
              No reviews yet
            </p>
          </div>
        )}
      </li>
    );
  };

  // Render a housing result item
  const renderHousingItem = (item: HousingViewResult) => (
    <li
      key={item.housing_id}
      className="bg-[#fafafa] p-3 sm:p-4 rounded-xl shadow flex flex-col gap-2 border-r-[.35rem] border-b-[.35rem] border-r-[#ebebeb] border-b-[#ebebeb]"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold break-words">
            {item.housing_name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {item.school_name}
          </p>
        </div>
        {/* Verification status indicator */}
        {item.is_verified && (
          <span className="text-green-600 text-sm font-semibold whitespace-nowrap self-start sm:self-center">
            ✔ Verified
          </span>
        )}
      </div>
    </li>
  );

  return (
    <main className="min-h-screen bg-[#315d8d] px-3 sm:px-4 md:px-6 lg:pl-[0.75rem] lg:pr-[0.75rem]">
      <TopFridge showSearchBar={true} back={true}>
        <AuthHeader />

        <div className={`flex flex-col items-center mt-[6.5rem] gap-2 px-2 sm:px-4 ${!loading && results.length > topResultsCount ? 'pb-2' : ''}`}>
          {/* Search Results Header */}
          <h1 className="text-[1.75rem] sm:text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] text-darkBlue text-center leading-none">
            Search Results
          </h1>
          <p className="text-[0.875rem] sm:text-[0.9rem] md:text-[0.95rem] lg:text-[1rem] text-[#696969] mb-4 sm:mb-6 text-center px-2">
            Showing results for <strong>{type}</strong>
            {type === "roommate" && roommateName && (
              <span className="italic font-sans">: {roommateName}</span>
            )}
            {location && (
              <span className="italic font-sans"> @ {location}</span>
            )}
          </p>

          {/* Loading State */}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : results.length > 0 ? (
            <ul className={`w-full max-w-4xl space-y-3 px-2 sm:px-4 ${results.length > topResultsCount ? 'mb-0' : ''}`}>
              {type === "roommate"
                ? Object.entries(topGroupedRoommates).map(([name, group]) =>
                    renderRoommateItem(name, group)
                  )
                : topHousingResults.map((item) => renderHousingItem(item))}
            </ul>
          ) : (
            <div className="mt-6 text-center px-4">
              <p className="text-gray-500 mb-4">No results found.</p>
            </div>
          )}
        </div>
      </TopFridge>

      {/* Bottom Fridge Section - Remaining Results */}
      {!loading && results.length > topResultsCount && (
        <BottomFridge>
          <div className="flex flex-col items-center gap-2 px-2 sm:px-4 pt-3">
            <ul className="w-full max-w-4xl space-y-3 px-2 sm:px-4">
              {type === "roommate"
                ? Object.entries(bottomGroupedRoommates).map(([name, group]) =>
                    renderRoommateItem(name, group)
                  )
                : bottomHousingResults.map((item) => renderHousingItem(item))}
            </ul>

            {/* Add New Item Button */}
            <Link
              href={type === "roommate" ? "/roommate/new" : "/housing/new"}
              className="inline-block mt-6 sm:mt-8 bg-lightBlue text-lazyDog text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-900 hover:transition shadow-[3px_3px_0_0_#0c4a6e] text-sm sm:text-base transition-colors"
            >
              Add a new {type === "roommate" ? "roommate" : "housing option"}
            </Link>
          </div>
        </BottomFridge>
      )}

      {/* Show "Add New" button in TopFridge if no overflow results */}
      {!loading && results.length > 0 && results.length <= topResultsCount && (
        <div className="flex justify-center -mt-[4rem] relative z-20">
          <Link
            href={type === "roommate" ? "/roommate/new" : "/housing/new"}
            className="inline-block bg-lightBlue text-lazyDog text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-900 hover:transition shadow-[3px_3px_0_0_#0c4a6e] text-sm sm:text-base transition-colors"
          >
            Add a new {type === "roommate" ? "roommate" : "housing option"}
          </Link>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </main>
  );
}
