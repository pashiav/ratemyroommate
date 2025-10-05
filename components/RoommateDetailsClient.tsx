"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import TopFridge from "@/components/TopFridge";
import BottomFridge from "@/components/BottomFridge";
import Footer from "@/components/Footer";
import AuthHeader from "@/components/AuthHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaThumbsDown, FaThumbsUp, FaPaw } from "react-icons/fa";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";

// Interface for review data structure
interface Review {
  rv_id: string;
  rating: number;
  comments: string;
  created_at: string;
  would_recommend: boolean;
  has_pets: boolean;
  pet_friendly: boolean | string | null;
  years_lived: string;
  noise_level: number;
  cleanliness: number;
  communication: number;
  responsibility: number;
  sleep_pattern: string;
  guest_frequency: string;
  study_compatibility: string;
  pet_type: string | null;
  pet_impact: string | null;
  unit_suffix: string | null;
  housing_id: string | null;
}

// Interface for roommate data structure
interface Roommate {
  rm_id: string;
  full_name: string;
  reviews: Review[];
}

export default function RoommateDetails() {
  // State management for roommate data and UI
  const [roommate, setRoommate] = useState<Roommate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, getToken } = useAuth();
  
  // State for housing information display
  const [housingInfo, setHousingInfo] = useState<{
    housing_name: string;
    school_name: string;
    is_verified: boolean;
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const reviewsRef = useRef<HTMLDivElement>(null);
  // State for expanding/collapsing review comments
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  
  const params = useParams();
  const searchParams = useSearchParams();

  const rm_id = params.id as string;
  const housing_id = searchParams.get("housing_id");
  const unit_suffix = searchParams.get("unit_suffix");

  // Toggle review comment expansion state
  const toggleExpanded = (rv_id: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [rv_id]: !prev[rv_id],
    }));
  };

  // Fetch roommate data and housing information
  useEffect(() => {
    async function fetchRoommate() {
      setLoading(true);
      setRoommate(null);
      setError(null);

      if (!isSignedIn) {
        setLoading(false);
        setError("User is not signed in");
        return;
      }

      try {
        const token = await getToken();
        // Fetch roommate reviews from API
        const res = await fetch(
          `/api/reviews?rm_id=${rm_id}&housing_id=${housing_id}&unit_suffix=${unit_suffix}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        const json = await res.json();
        // Fetch housing information if available
        if (json.roommate?.reviews?.[0]?.housing_id) {
          const housingId = json.roommate.reviews[0].housing_id;
          const housingRes = await fetch(`/api/housing/${housingId}`);
          const housingJson = await housingRes.json();
          if (housingRes.ok) {
            setHousingInfo(housingJson);
          } else {
            console.warn("Failed to load housing info", housingJson.error);
          }
        }

        if (!res.ok) throw new Error(json.error || "Unknown error");

        setRoommate(json.roommate);
      } catch (err: any) {
        setError(err.message || "Failed to load roommate details");
      } finally {
        setLoading(false);
      }
    }

    fetchRoommate();
  }, [rm_id, isSignedIn, getToken]);

  // Calculate average rating from all reviews
  const averageRating = roommate?.reviews?.length
    ? roommate.reviews.reduce((sum, r) => sum + r.rating, 0) /
      roommate.reviews.length
    : 0;

  // Component for displaying trait rating bars
  function TraitBar({ label, value }: { label: string; value: number }) {
    return (
      <div className="flex items-center gap-3 text-[#6d4d55] text-xs sm:text-sm">
        <span className="w-24 sm:w-28 md:w-32">{label}</span>
        <div className="w-40 sm:w-40 md:flex-1 bg-[#ebebeb] h-4 sm:h-5 rounded-full">
          <div
            className="h-4 sm:h-5 bg-[#c4adb9] rounded-full"
            style={{ width: `${(value / 5) * 100}%` }}
          />
        </div>
        <span className="w-8 text-right">{value.toFixed(1)}</span>
      </div>
    );
  }

  // Component for displaying colored tags
  function Tag({ text, color }: { text: string; color: string }) {
    const bg =
      {
        red: "bg-[#ff5757]",
        green: "bg-[#7ed957]",
      }[color] || "bg-gray-200";

    return (
      <span className={`text-xs sm:text-sm text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded font-bold ${bg}`}>
        {text}
      </span>
    );
  }

  // Calculate average trait values across all reviews
  const avgTrait = (key: keyof Review): number => {
    return roommate?.reviews?.length
      ? roommate.reviews.reduce((sum, r) => sum + Number(r[key] ?? 0), 0) /
          roommate.reviews.length
      : 0;
  };

  // Calculate dynamic tags based on reviews
  const hasPets = roommate?.reviews.some(r => r.has_pets) ?? false;
  const isPetFriendly = roommate?.reviews.some(r => 
    r.pet_friendly === true || r.pet_friendly === 'yes'
  ) ?? false;

  return (
    <main className="min-h-screen bg-[#315d8d] px-3 sm:px-4 md:pl-[0.75rem] md:pr-[0.75rem] font-lazyDog">
      <TopFridge showSearchBar={true} back={true}>
        <AuthHeader />

        <div className="max-w-5xl mx-auto w-full text-lazyDog px-2 sm:px-4">
          {loading ? (
            <Loading text="Loading"/>
          ) : error ? (
            /* Error state display */
            <div className="bg-[#fafafa] rounded-3xl p-4 sm:p-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Link
                href="/"
                className="inline-block bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-blue-500"
              >
                Back to Search
              </Link>
            </div>
          ) : roommate && roommate.reviews.length === 0 ? (
            /* No reviews state display */
            <div className="mt-20 sm:mt-32 bg-white text-darkBlue w-full max-w-2xl mx-auto rounded-3xl border-4 sm:border-[0.90rem] border-darkBlue px-4 sm:px-8 py-8 sm:py-12 text-center">
              <h1 className="text-3xl sm:text-[3rem] mb-4">{roommate.full_name}</h1>
              <p className="text-base sm:text-lg mb-6">No reviews yet for this roommate.</p>
              {isSignedIn && (
                <Link
                  href={`/roommate/${rm_id}/review/new`}
                  className="bg-lightBlue text-white px-6 py-3 rounded-md hover:bg-blue-800 transition-colors border-r-4 border-b-4 border-darkBlue"
                >
                  Write the First Review
                </Link>
              )}
            </div>
          ) : roommate ? (
            /* Main roommate profile display */
            <div className="mt-20 sm:mt-24 md:mt-[6.75rem] flex flex-col items-center">
              <p className="text-[.6rem] sm:text-[.7rem] italic text-center text-gray-400 -mt-4 mb-2 font-sans px-2">
                Reviews are grouped by name and living location. If this seems
                like multiple people,{" "}
                <a href="#" className="underline">
                  let us know
                </a>
                .
              </p>
              <div className="w-[80vw] sm:w-[80vw] md:w-[70vw] lg:w-[65vw] xl:w-[60vw] max-w-4xl bg-white rounded-xl sm:rounded-[2rem] pt-4 px-4 sm:px-8 md:px-12 lg:px-16 pb-8 sm:pb-16 border-4 sm:border-[0.90rem] border-darkBlue text-darkBlue font-lazyDog">
                {/* Roommate Name Header */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] mt-2 text-center break-words">
                  {roommate.full_name}
                </h1>
                {/* Housing Information */}
                <p className="text-center text-xs sm:text-sm md:text-md mt-2 pb-2 text-gray-600">
                  <FontAwesomeIcon icon={faHouse} className="pr-2" />
                  {housingInfo?.housing_name ?? "Unknown Housing"}
                  {roommate.reviews[0]?.unit_suffix &&
                    ` — Unit #...${roommate.reviews[0].unit_suffix}`}
                  {" — 2025"}
                </p>

                <div className="flex flex-col md:flex-row my-4 md:my-6 w-full gap-4 md:gap-0">
                  {/* Left side: Average rating and star display */}
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl sm:text-6xl md:text-[4.5rem] leading-none">
                        {averageRating.toFixed(2)}
                        <span className="text-gray-400 text-xl sm:text-2xl md:text-[1.75rem] relative -top-6 sm:-top-7 md:-top-8 ml-1 tracking-[.15rem] sm:tracking-[.25rem]">
                          /5
                        </span>
                      </div>
                      {/* Star rating display with full/half star logic */}
                      <div className="flex justify-center mb-2 gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const full = star <= Math.floor(averageRating);
                          const half =
                            !full &&
                            star - 1 < averageRating &&
                            averageRating < star;

                          return (
                            <div key={star} className="relative w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10">
                              {/* Empty star background */}
                              <svg
                                className="absolute top-0 left-0 w-full h-full text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>

                              {/* Full star overlay */}
                              {full && (
                                <svg
                                  className="absolute top-0 left-0 w-full h-full text-gold"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              )}

                              {/* Half star overlay */}
                              {half && (
                                <svg
                                  className="absolute top-0 left-0 w-full h-full text-gold overflow-hidden"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  style={{ clipPath: "inset(0 50% 0 0)" }}
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Vertical divider */}
                  <div className="hidden md:block w-[1px] bg-[#70768d] mx-4 lg:mx-8" />

                  {/* Right side: Rating distribution and review count */}
                  <div className="w-full md:w-1/2 px-2 sm:px-4 flex flex-col items-center md:items-start">
                    <p className="text-base sm:text-lg md:text-[1.25rem] text-lightBlue text-center md:text-left">
                      Based on{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Smooth scroll to reviews section
                          if (reviewsRef.current) {
                            const offset = -80; // adjust this value as needed
                            const y =
                              reviewsRef.current.getBoundingClientRect().top +
                              window.scrollY +
                              offset;
                            window.scrollTo({ top: y, behavior: "smooth" });
                          }
                        }}
                        className="underline cursor-pointer"
                      >
                        {roommate.reviews.length} review
                        {roommate.reviews.length !== 1 ? "s" : ""}
                      </a>
                    </p>
                    {/* Rating distribution bars */}
                    <div className="flex flex-col items-center md:items-start w-full">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = roommate.reviews.filter(
                          (r) => r.rating === star
                        ).length;
                        return (
                          <div key={star} className="flex items-center gap-2 w-full justify-center md:justify-start">
                            <span className="w-6">
                              {star}
                              <span className="text-[.85rem] relative -top-[0.1rem]">
                                ★
                              </span>
                            </span>
                            <div className="h-5 bg-lightGray rounded-full w-2/3 border-darkBlue border-2">
                              <div
                                className="h-4 bg-[#c1ccd8] rounded-full"
                                style={{
                                  width: `${(count / roommate.reviews.length) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[1rem]">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <hr className="mt-[1rem] border-t border-[#70768d]" />

                <div className="flex flex-col md:flex-row w-full mt-6 gap-6">
                  {/* Left: Trait rating bars */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start">
                    <div className="grid grid-cols-1 gap-2 text-sm mt-[1rem] mb-8">
                      <TraitBar
                        label="Cleanliness"
                        value={avgTrait("cleanliness")}
                      />
                      <TraitBar
                        label="Communication"
                        value={avgTrait("communication")}
                      />
                      <TraitBar
                        label="Responsibility"
                        value={avgTrait("responsibility")}
                      />
                      <TraitBar
                        label="Noise-Level"
                        value={avgTrait("noise_level")}
                      />
                    </div>
                  </div>
                  
                  {/* Vertical divider */}
                  <div className="hidden md:block w-[1px] bg-[#70768d] mx-4" />
                  
                  {/* Right: Tags and attributes */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    {(hasPets || isPetFriendly) && (
                      <div className="flex flex-col gap-1 mb-4">
                        <p className="text-lg sm:text-xl md:text-[1.5rem] text-lightBlue">Tags:</p>
                        {/* Display roommate tags */}
                        <div className="flex gap-2 flex-wrap mt-2 mb-4">
                          {hasPets && <Tag text="PETS" color="red" />}
                          {isPetFriendly && <Tag text="PET-FRIENDLY" color="green" />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </TopFridge>

      {/* Bottom section with reviews */}
      <BottomFridge>
        <div
          ref={reviewsRef}
          className="max-w-2xl mx-auto w-full text-lazyDog space-y-4 sm:space-y-6 px-3 sm:px-4"
        >
          {/* Reviews section header */}
          <h2 className="text-2xl sm:text-3xl md:text-[2rem] text-darkBlue font-bold">
            Reviews ({roommate?.reviews.length || 0})
          </h2>
          
          {/* Write review button for signed-in users */}
          {isSignedIn && (
            <Link
              href={`/roommate/${rm_id}/review/new`}
              className="inline-block bg-lightBlue text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors border-r-4 border-b-4 border-darkBlue text-sm sm:text-base"
            >
              Write a Review
            </Link>
          )}
          
          {/* Individual review display */}
          {roommate?.reviews.map((review) => (
            <div
              key={review.rv_id}
              className="bg-white border-[0.25rem] border-darkBlue rounded-xl px-4 py-3 mb-4"
            >
              {/* Review header with rating and date */}
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-gold">{review.rating}</span>
                  <span className="text-lg text-gold">★</span>
                </div>
                <span className="text-[0.625rem] xs:text-xs text-darkBlue italic font-sans">
                  {new Date(review.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>

              {/* Review comments section */}
              <div className="mb-3 p-2.5 bg-[#f0f4f8] rounded-md border-l-2 border-lightBlue">
                <p className="text-darkBlue text-[0.75rem] xs:text-sm leading-snug font-sans italic">
                  "{expandedReviews[review.rv_id] || review.comments.length <= 150
                    ? review.comments
                    : `${review.comments.slice(0, 225)}...`}"
                </p>
                {review.comments.length > 150 && (
                  <button
                    onClick={() => toggleExpanded(review.rv_id)}
                    className="mt-1 text-lightBlue underline font-semibold hover:text-darkBlue transition-colors text-[0.625rem] xs:text-xs font-sans"
                  >
                    {expandedReviews[review.rv_id] ? "See less" : "See more"}
                  </button>
                )}
              </div>

              {/* Key Info Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className={`px-2 py-1 rounded-full text-[0.625rem] xs:text-xs font-bold ${review.would_recommend ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {review.would_recommend ? (
                    <>
                      <FaThumbsUp className="inline mr-1" /> Recommend
                    </>
                  ) : (
                    <>
                      <FaThumbsDown className="inline mr-1" /> Not Recommend
                    </>
                  )}
                </span>
                <span className="px-2 py-1 rounded-full text-[0.625rem] xs:text-xs font-bold bg-blue-100 text-blue-700">
                {review.years_lived} {Number(review.years_lived) === 1 ? "year" : "years"} lived
                </span>
                {review.has_pets && (
                  <span className="px-2 py-1 rounded-full text-[0.625rem] xs:text-xs font-bold bg-purple-100 text-purple-700">
                    <FaPaw className="inline mr-1" /> Pets
                  </span>
                )}
              </div>

              {/* Compact Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[0.625rem] xs:text-xs font-lazyDog">
                <div className="flex flex-col p-2 bg-[#fafafa] rounded">
                  <span className="text-[#c4adb9]">Cleanliness</span>
                  <span className="text-[#6d4d55] font-bold">{review.cleanliness}/5</span>
                </div>
                <div className="flex flex-col p-2 bg-[#fafafa] rounded">
                  <span className="text-[#c4adb9]">Communication</span>
                  <span className="text-[#6d4d55] font-bold">{review.communication}/5</span>
                </div>
                <div className="flex flex-col p-2 bg-[#fafafa] rounded">
                  <span className="text-[#c4adb9]">Responsibility</span>
                  <span className="text-[#6d4d55] font-bold">{review.responsibility}/5</span>
                </div>
                <div className="flex flex-col p-2 bg-[#fafafa] rounded">
                  <span className="text-[#c4adb9]">Noise</span>
                  <span className="text-[#6d4d55] font-bold">{review.noise_level}/5</span>
                </div>
                <div className="flex flex-col p-2 bg-[#fafafa] rounded">
                  <span className="text-[#c4adb9]">Sleep</span>
                  <span className="text-[#6d4d55] font-bold capitalize">{review.sleep_pattern}</span>
                </div>
                <div className="flex flex-col p-2 bg-[#fafafa] rounded">
                  <span className="text-[#c4adb9]">Guests</span>
                  <span className="text-[#6d4d55] font-bold capitalize">{review.guest_frequency}</span>
                </div>
                <div className="flex flex-col p-2 bg-[#fafafa] rounded">
                  <span className="text-[#c4adb9]">Study</span>
                  <span className="text-[#6d4d55] font-bold capitalize">{review.study_compatibility}</span>
                </div>
                {review.has_pets && review.pet_type && (
                  <div className="flex flex-col p-2 bg-[#fafafa] rounded">
                    <span className="text-[#c4adb9]">Pet</span>
                    <span className="text-[#6d4d55] font-bold capitalize">{review.pet_type}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </BottomFridge>
      <Footer />
    </main>
  );
}
