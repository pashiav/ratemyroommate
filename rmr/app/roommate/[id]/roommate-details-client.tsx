"use client";

import { useEffect, useState } from "react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";

interface Review {
  rv_id: string;
  rating: number;
  would_recommend: boolean;
  has_pets: boolean;
  pet_friendly: boolean;
  years_lived: number;
  comments: string;
  created_at: string;
}

interface Places {
  name: string;
  school?: string;
}

interface Roommate {
  rm_id: string;
  name: string;
  unit_end: number;
  places: Places;
  reviews: Review[];
}

export default function RoommateDetails({ id }: { id: string }) {
  const [roommate, setRoommate] = useState<Roommate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, getToken } = useAuth();

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
        const fetchOptions: RequestInit = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        };

        // 🔁 If your folder is named "roommates", use plural:
        const res = await fetch(`/api/roommates/${id}`, fetchOptions);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Failed to fetch roommate. Status: ${res.status}, ID: ${id}, Message: ${errorText}`
          );
        }

        const data: Roommate = await res.json();
        setRoommate(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Failed to load roommate details: ${err.message}`);
        } else {
          setError(`Unexpected error loading roommate with ID: ${id}`);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRoommate();
  }, [id, isSignedIn, getToken]);

  const averageRating = roommate?.reviews?.length
    ? roommate.reviews.reduce((sum, review) => sum + review.rating, 0) /
      roommate.reviews.length
    : 0;

  return (
    <main className="min-h-screen bg-[#315d8d] pl-4 pr-4 font-lazyDog">
      <TopFridge>
        <AuthHeader />

        <div className="max-w-3xl mx-auto w-full mt-[8rem] text-lazyDog">
          {loading ? (
            <p>Loading roommate details...</p>
          ) : error ? (
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Link
                href="/"
                className="inline-block bg-navy-blue text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Back to Search
              </Link>
            </div>
          ) : roommate ? (
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="mb-6">
                <Link
                  href="/search"
                  className="inline-flex items-center text-navy-blue hover:underline mb-4"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

                <h1 className="text-4xl font-bold text-gray-800">
                  {roommate.name}
                </h1>
                <p className="text-xl text-gray-600 mt-1">
                  Unit {roommate.unit_end}
                </p>
                <p className="text-lg text-gray-600">{roommate.places.name}</p>
                {roommate.places.school && (
                  <p className="text-gray-500">{roommate.places.school}</p>
                )}
              </div>

              <div className="mb-10">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-xl font-medium text-gray-700">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({roommate.reviews.length} review
                    {roommate.reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>

                <Link
                  href={`/roommate/${id}/review/new`}
                  className="inline-block bg-darkblue text-white px-6 py-2 rounded-md hover:bg-blue-800"
                >
                  Leave a Review
                </Link>
              </div>

              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Reviews</h2>

              {roommate.reviews.length > 0 ? (
                <div className="space-y-6">
                  {roommate.reviews.map((review) => (
                    <div key={review.rv_id} className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {review.rating}/5
                        </span>
                        <span className="ml-auto text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {review.would_recommend && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Would recommend
                          </span>
                        )}
                        {review.has_pets && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Has pets
                          </span>
                        )}
                        {review.pet_friendly && (
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Pet friendly
                          </span>
                        )}
                        {review.years_lived > 0 && (
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {review.years_lived} year
                            {review.years_lived !== 1 ? "s" : ""} lived
                          </span>
                        )}
                      </div>

                      {review.comments && (
                        <p className="text-gray-700">{review.comments}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">
                    No reviews yet. Be the first to leave a review!
                  </p>
                  <Link
                    href={`/roommate/${id}/review/new`}
                    className="inline-block bg-navy-blue text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Leave a Review
                  </Link>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </TopFridge>
    </main>
  );
}
