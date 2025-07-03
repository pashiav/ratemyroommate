"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import TopFridge from "@/components/TopFridge";
import BottomFridge from "@/components/BottomFridge";
import AuthHeader from "@/components/AuthHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";

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

interface Roommate {
  rm_id: string;
  full_name: string;
  reviews: Review[];
}

export default function RoommateDetails() {
  const [roommate, setRoommate] = useState<Roommate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, getToken } = useAuth();
  const [housingInfo, setHousingInfo] = useState<{
    housing_name: string;
    school_name: string;
    is_verified: boolean;
    latitude: number;
    longitude: number;
  } | null>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const params = useParams();
  const searchParams = useSearchParams();

  const rm_id = params.id as string;
  const housing_id = searchParams.get("housing_id");
  const unit_suffix = searchParams.get("unit_suffix");

  const toggleExpanded = (rv_id: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [rv_id]: !prev[rv_id],
    }));
  };

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

  const averageRating = roommate?.reviews?.length
    ? roommate.reviews.reduce((sum, r) => sum + r.rating, 0) /
      roommate.reviews.length
    : 0;

  function TraitBar({ label, value }: { label: string; value: number }) {
    return (
      <div className="flex items-center gap-2 text-[#6d4d55]">
        <span className="w-[7rem]">{label}</span>
        <div className="flex-1 bg-[#ebebeb] h-5 rounded-full">
          <div
            className="h-5 bg-[#c4adb9] rounded-full"
            style={{ width: `${(value / 5) * 100}%` }}
          />
        </div>
        <span>{value.toFixed(1)}</span>
      </div>
    );
  }

  function Tag({ text, color }: { text: string; color: string }) {
    const bg =
      {
        red: "bg-[#ff5757]",
        green: "bg-[#7ed957]",
      }[color] || "bg-gray-200";

    return (
      <span className={`text-sm text-white px-3 py-2 rounded font-bold ${bg}`}>
        {text}
      </span>
    );
  }

  const avgTrait = (key: keyof Review): number => {
    return roommate?.reviews?.length
      ? roommate.reviews.reduce((sum, r) => sum + Number(r[key] ?? 0), 0) /
          roommate.reviews.length
      : 0;
  };

  return (
    <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem] font-lazyDog">
      <TopFridge showSearchBar={true} back={true}>
        <AuthHeader />

        <div className="max-w-3xl mx-auto w-full text-lazyDog">
          {loading ? (
            <Loading text="Loading"/>
          ) : error ? (
            <div className="bg-[#fafafa] rounded-3xl shadow-lg p-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Link
                href="/"
                className="inline-block bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-blue-500"
              >
                Back to Search
              </Link>
            </div>
          ) : roommate && roommate.reviews.length === 0 ? (
            <div className="mt-[8rem] bg-white text-darkBlue w-full max-w-2xl rounded-3xl shadow-xl border-[0.90rem] border-darkBlue px-8 py-12 text-center">
              <h1 className="text-[3rem] mb-4">{roommate.full_name}</h1>
              <p className="text-lg mb-6">No reviews yet for this roommate.</p>
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
            <div className="mt-[6.75rem] flex flex-col items-center">
              <p className="text-[.7rem] italic text-center text-gray-400 -mt-4 mb-2 font-sans">
                Reviews are grouped by name and living location. If this seems
                like multiple people,{" "}
                <a href="#" className="underline">
                  let us know
                </a>
                .
              </p>
              <div className="w-[50vw] bg-white rounded-[2rem] shadow-xl pt-4 pr-16 pl-16 pb-16 border-[0.90rem] border-darkBlue text-darkBlue font-lazyDog">
                <h1 className="text-[3.25rem] text-center">
                  {roommate.full_name}
                </h1>
                <p className="text-center text-md -mt-2 pb-2 text-gray-600">
                  <FontAwesomeIcon icon={faHouse} className="pr-2" />
                  {housingInfo?.housing_name ?? "Unknown Housing"}
                  {roommate.reviews[0]?.unit_suffix &&
                    ` — Unit #...${roommate.reviews[0].unit_suffix}`}
                  {" — 2025"}
                </p>

                <div className="flex flex-col md:flex-row my-6 w-full">
                  <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    {/* left side: averageRating and stars */}
                    <div className="text-center">
                      <div className="text-[4.5rem] leading-none">
                        {averageRating.toFixed(2)}
                        <span className="text-gray-400 text-[1.75rem] relative -top-8 ml-1 tracking-[.25rem]">
                          /5
                        </span>
                      </div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const full = star <= Math.floor(averageRating);
                          const half =
                            !full &&
                            star - 1 < averageRating &&
                            averageRating < star;

                          return (
                            <div key={star} className="relative w-10 h-10">
                              {/* Empty star in background */}
                              <svg
                                className="absolute top-0 left-0 w-10 h-10 text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>

                              {/* Full or Half star in foreground */}
                              {full && (
                                <svg
                                  className="absolute top-0 left-0 w-10 h-10 text-gold"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              )}

                              {half && (
                                <svg
                                  className="absolute top-0 left-0 w-10 h-10 text-gold overflow-hidden"
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

                  <div className="w-[1px] bg-[#70768d] ml-8" />

                  <div className="w-full ml-8 md:w-1/2 px-4">
                    {/* right side: bars and text */}
                    <p className="text-[1.25rem] text-lightBlue">
                      Based on{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
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
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = roommate.reviews.filter(
                        (r) => r.rating === star
                      ).length;
                      return (
                        <div key={star} className="flex items-center gap-2">
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

                <hr className="mt-[1rem] border-t border-[#70768d]" />

                <div className="flex flex-col md:flex-row w-full mt-6 gap-6">
                  {/* Left: Trait Bars */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    {/* Trait Bars */}
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
                  {/* Divider */}
                  <div className="hidden md:block w-[1px] bg-[#70768d] mx-4" />
                  {/* Right: Tags and Aliases */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <div className="flex flex-col gap-1 mb-4">
                      <p className="text-[1.5rem] text-lightBlue">Tags:</p>
                      {/* Tags */}
                      <div className="flex gap-2 flex-wrap mt-2 mb-4">
                        <Tag text="PETS" color="red" />
                        <Tag text="PET-FRIENDLY" color="green" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </TopFridge>

      <BottomFridge>
        <div
          ref={reviewsRef}
          className="max-w-3xl mx-auto w-full text-lazyDog space-y-6"
        >
          <h2 className="text-[2rem] text-darkBlue font-bold">
            Reviews ({roommate?.reviews.length || 0})
          </h2>
          {isSignedIn && (
            <Link
              href={`/roommate/${rm_id}/review/new`}
              className="bg-lightBlue text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors border-r-4 border-b-4 border-darkBlue"
            >
              Write a Review
            </Link>
          )}
          {roommate?.reviews.map((review) => (
            <div
              key={review.rv_id}
              className="bg-[#f9f9f9] border border-gray-300 rounded-xl px-6 py-4 mb-6 shadow-md"
            >
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>
                  Rating: <strong>{review.rating}★</strong>
                </span>
                <span>{new Date(review.created_at).toLocaleDateString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-800">
                <p>
                  <strong>Would Recommend:</strong>{" "}
                  {review.would_recommend ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Has Pets:</strong> {review.has_pets ? "Yes" : "No"}
                </p>
                {review.has_pets && (
                  <>
                    <p>
                      <strong>Pet Friendly:</strong> {review.pet_friendly}
                    </p>
                    <p>
                      <strong>Pet Type:</strong> {review.pet_type ?? "N/A"}
                    </p>
                    <p>
                      <strong>Pet Impact:</strong> {review.pet_impact ?? "N/A"}
                    </p>
                  </>
                )}
                <p>
                  <strong>Years Lived:</strong> {review.years_lived}
                </p>
                <p>
                  <strong>Cleanliness:</strong> {review.cleanliness}/5
                </p>
                <p>
                  <strong>Communication:</strong> {review.communication}/5
                </p>
                <p>
                  <strong>Responsibility:</strong> {review.responsibility}/5
                </p>
                <p>
                  <strong>Noise Level:</strong> {review.noise_level}/5
                </p>
                <p>
                  <strong>Sleep Pattern:</strong> {review.sleep_pattern}
                </p>
                <p>
                  <strong>Guest Frequency:</strong> {review.guest_frequency}
                </p>
                <p>
                  <strong>Study Compatibility:</strong>{" "}
                  {review.study_compatibility}
                </p>
                {review.unit_suffix && (
                  <p>
                    <strong>Unit #:</strong> {review.unit_suffix}
                  </p>
                )}
              </div>
              <div className="mb-2 mt-4 text-lightBlue">
                "
                {expandedReviews[review.rv_id] || review.comments.length <= 150
                  ? review.comments
                  : `${review.comments.slice(0, 225)}...`}
                "
                {review.comments.length > 150 && (
                  <button
                    onClick={() => toggleExpanded(review.rv_id)}
                    className="ml-2 text-darkBlue underline font-semibold"
                  >
                    {expandedReviews[review.rv_id] ? "See less" : "See more"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </BottomFridge>
    </main>
  );
}
