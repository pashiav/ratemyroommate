"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";

interface Review {
  rv_id: string;
  rating: number;
  comments: string;
  created_at: string;
  would_recommend: boolean;
  has_pets: boolean;
  pet_friendly: boolean;
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
  housing: {
    housing_name: string;
  };
}

interface Roommate {
  rm_id: string;
  full_name: string;
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
        const res = await fetch(`/api/roommates/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Unknown error");

        setRoommate(json.roommate);
      } catch (err: any) {
        setError(err.message || "Failed to load roommate details");
      } finally {
        setLoading(false);
      }
    }

    fetchRoommate();
  }, [id, isSignedIn, getToken]);

  const averageRating = roommate?.reviews?.length
    ? roommate.reviews.reduce((sum, r) => sum + r.rating, 0) / roommate.reviews.length
    : 0;

  return (
    <main className="min-h-screen bg-[#315d8d] pl-4 pr-4 font-lazyDog">
      <TopFridge showSearchBar={true}>
        <AuthHeader />

        <div className="max-w-3xl mx-auto w-full mt-[8rem] text-lazyDog">
          {loading ? (
            <p>Loading roommate details...</p>
          ) : error ? (
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Link href="/" className="inline-block bg-navy-blue text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Back to Search
              </Link>
            </div>
          ) : roommate ? (
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-800">{roommate.full_name}</h1>

              {roommate.reviews[0]?.housing?.housing_name && (
                <p className="text-lg text-gray-600 mt-1">
                  <span className="font-bold">Housing:</span> {roommate.reviews[0].housing.housing_name}
                </p>
              )}

              <div className="mt-4 mb-8">
                <div className="flex items-center">
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
                    ({roommate.reviews.length} review{roommate.reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>

                <Link
                  href={`/roommate/${id}/review/new`}
                  className="inline-block bg-darkBlue text-white px-6 py-2 mt-4 rounded-md hover:bg-blue-800"
                >
                  Leave a Review
                </Link>
              </div>

              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Reviews</h2>

              {roommate.reviews.length > 0 ? (
                <div className="space-y-6">
                  {roommate.reviews.map((review) => (
                    <div key={review.rv_id} className="border-b pb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                        <span>{review.rating}/5</span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comments}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {review.would_recommend && <Badge text="Would recommend" color="green" />}
                        {review.has_pets && <Badge text="Has pets" color="blue" />}
                        {review.pet_friendly && <Badge text="Pet friendly" color="purple" />}
                        {review.years_lived && <Badge text={`Lived ${review.years_lived} years`} color="gray" />}
                        {review.sleep_pattern && <Badge text={`Sleeps: ${review.sleep_pattern}`} color="gray" />}
                        {review.guest_frequency && <Badge text={`Guests: ${review.guest_frequency}`} color="gray" />}
                        {review.study_compatibility && <Badge text={`Study: ${review.study_compatibility}`} color="gray" />}
                        {review.pet_type && <Badge text={`Pet: ${review.pet_type}`} color="gray" />}
                        {review.pet_impact && <Badge text={`Impact: ${review.pet_impact}`} color="gray" />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-8">No reviews yet.</p>
              )}
            </div>
          ) : null}
        </div>
      </TopFridge>
    </main>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`bg-${color}-100 text-${color}-800 font-medium px-2 py-0.5 rounded`}>
      {text}
    </span>
  );
}
