"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface ReviewFormProps {
  roommate_id: string;
}
interface HousingViewResult {
  housing_id: string;
  housing_name: string;
  is_verified: boolean;
}

function InfoTip({ message }: { message: string }) {
  return (
    <span className="relative group ml-2 cursor-pointer text-gray-500">
      ⓘ
      <div className="absolute z-10 hidden group-hover:block bg-white text-darkBlue text-xs px-2 py-1 rounded border-2 border-gray-200 top-full left-1/2 transform -translate-x-1/2 mt-1 w-64 whitespace-pre-line">
        {message}
      </div>
    </span>
  );
}

export default function ReviewForm({ roommate_id }: ReviewFormProps) {
  const router = useRouter();
  const { userId, getToken, isLoaded, isSignedIn } = useAuth();

  const [rating, setRating] = useState(5);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [petFriendly, setPetFriendly] = useState("");
  const [hasPets, setHasPets] = useState<boolean | null>(null);
  const [yearsLived, setYearsLived] = useState("");
  const [comments, setComments] = useState("");

  const [noiseLevel, setNoiseLevel] = useState(3);
  const [cleanliness, setCleanliness] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [responsibility, setResponsibility] = useState(3);

  const [sleepPattern, setSleepPattern] = useState("");
  const [guestFrequency, setGuestFrequency] = useState("");
  const [studyCompatibility, setStudyCompatibility] = useState("");

  const [unitSuffix, setUnitSuffix] = useState("");
  const [petType, setPetType] = useState("");
  const [petImpact, setPetImpact] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [housingOptions, setHousingOptions] = useState<HousingViewResult[]>([]);
  const [housingId, setHousingId] = useState("");

  useEffect(() => {
    async function fetchHousing() {
      try {
        const res = await fetch("/api/housing", { cache: "no-store" });
        const data = await res.json();
        setHousingOptions(data);
      } catch (err) {
        console.error("Failed to fetch housing data:", err);
      }
    }

    fetchHousing();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn || !userId) {
      setError("You must be signed in to leave a review");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = await getToken();
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          would_recommend: wouldRecommend,
          has_pets: hasPets,
          pet_friendly: petFriendly || null,
          years_lived: yearsLived,
          comments,
          rm_id: roommate_id,
          reviewer_id: userId,
          housing_id: housingId,
          unit_suffix: unitSuffix || null,
          noise_level: noiseLevel,
          cleanliness: cleanliness,
          communication: communication,
          responsibility: responsibility,
          sleep_pattern: sleepPattern,
          guest_frequency: guestFrequency,
          study_compatibility: studyCompatibility,
          pet_type: petType || null,
          pet_impact: petImpact || null,
        }),
      });
      const text = await response.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok)
        throw new Error(data.error || "Failed to submit review");

      setSuccessMessage("Review submitted successfully!");
      setTimeout(() => {
        router.push(`/roommate/${roommate_id}`);
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <p>You must be signed in</p>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Leave a Review</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
      <div>
        <label className="block text-gray-700 text-lg mb-2">
          Rating
          <InfoTip message="Overall roommate experience. 1 = very poor, 5 = excellent." />
        </label>
        <div className="flex mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none mr-1"
              aria-label={`Rate ${star} stars`}
            >
              <svg
                className={`w-8 h-8 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 self-center text-gray-600">{rating}/5</span>
        </div>
      </div>

      <div>
  <label className="block font-medium mb-1 items-center gap-1">
    Would you recommend?
    <InfoTip message="Would you live with this person again or recommend them to someone else?" />
  </label>
  <div className="flex gap-4">
    <button
      type="button"
      className={`px-4 py-2 rounded-md ${wouldRecommend === true ? "bg-green-600 text-white" : "bg-gray-200"}`}
      onClick={() => setWouldRecommend(true)}
    >
      Yes
    </button>
    <button
      type="button"
      className={`px-4 py-2 rounded-md ${wouldRecommend === false ? "bg-red-600 text-white" : "bg-gray-200"}`}
      onClick={() => setWouldRecommend(false)}
    >
      No
    </button>
  </div>
</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          {[
            {
              label: "Noise Level",
              value: noiseLevel,
              setter: setNoiseLevel,
              tip: "How loud were they on average? 1 = silent, 5 = very noisy.",
            },
            {
              label: "Cleanliness",
              value: cleanliness,
              setter: setCleanliness,
              tip: "How clean were they? 1 = very messy, 5 = very clean.",
            },
            {
              label: "Communication",
              value: communication,
              setter: setCommunication,
              tip: "Were they clear and respectful when communicating?",
            },
            {
              label: "Responsibility",
              value: responsibility,
              setter: setResponsibility,
              tip: "Did they pay bills and do chores reliably?",
            },
          ].map(({ label, value, setter, tip }) => (
            <div key={label}>
              <label className="block font-medium mb-1 items-center gap-1">
                {label}
                <InfoTip message={tip} />
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={value}
                  onChange={(e) => setter(parseInt(e.target.value))}
                  className="slider w-full"
                />
                <span className="text-sm text-gray-600 font-semibold">
                  {value}/5
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-6 mt-6">
          {[
            {
              label: "Years Lived Together",
              value: yearsLived,
              setter: setYearsLived,
              options: ["<1", "1", "2", "3+"],
              tip: "How many years did you live with this roommate?",
            },
            {
              label: "Sleep Pattern",
              value: sleepPattern,
              setter: setSleepPattern,
              options: ["early", "late", "variable"],
              tip: "What time were they usually active or asleep?",
            },
            {
              label: "Guest Frequency",
              value: guestFrequency,
              setter: setGuestFrequency,
              options: ["low", "medium", "high"],
              tip: "How often did they have guests over?",
            },
            {
              label: "Study Compatibility",
              value: studyCompatibility,
              setter: setStudyCompatibility,
              options: ["yes", "somewhat", "no"],
              tip: "Were their habits compatible with your study time?",
            },
          ].map(({ label, value, setter, options, tip }) => (
            <div key={label}>
              <label className="block font-medium mb-1 items-center gap-1">
                {label}
                <InfoTip message={tip} />
              </label>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                className="w-full border rounded-md p-2"
              >
                <option value="">Select</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div>
          <label className="block font-medium mb-1 items-center gap-1">
            Pet Friendly?
            <InfoTip message="Were they kind, respectful, and accommodating to pets — regardless of whether they had one?" />
          </label>
          <div className="flex gap-4">
            {["yes", "no", "n/a"].map((option) => (
              <button
                key={option}
                type="button"
                className={`px-4 py-2 rounded-md ${
                  petFriendly === option
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setPetFriendly(option)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1 items-center gap-1">
            Pets?
            <InfoTip message="Did this roommate have any pets?" />
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${hasPets === true ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setHasPets(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${hasPets === false ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setHasPets(false)}
            >
              No
            </button>
          </div>
        </div>

        {hasPets && (
          <div className="border border-blue-400 bg-blue-50 p-4 rounded-xl space-y-4 mt-4">
            <div>
              <label className="block font-medium mb-1 items-center gap-1">
                Pet Type (Optional)
                <InfoTip message="What kind of pet(s) did they have? (e.g. dog, cat, bird)" />
              </label>
              <input
                type="text"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 items-center gap-1">
                Pet Impact (Optional)
                <InfoTip message="How much did the pet(s) affect your living experience?" />
              </label>
              <select
                value={petImpact}
                onChange={(e) => setPetImpact(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select</option>
                <option value="minimal">Minimal</option>
                <option value="moderate">Moderate</option>
                <option value="significant">Significant</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <label className="block font-medium mb-1 items-center gap-1">
              Where did you live together?
              <InfoTip message="Select the housing where you and this roommate lived." />
            </label>
            <select
              value={housingId}
              onChange={(e) => setHousingId(e.target.value)}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">Select housing</option>
              {housingOptions.map((h) => (
                <option key={h.housing_id} value={h.housing_id}>
                  {h.housing_name} {h.is_verified ? "✅" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 items-center gap-1">
              Unit End #...? (Optional)
              <InfoTip message={"e.g. Unit #993C → C\ne.g. Unit #4381 → 1"} />
            </label>
            <input
              type="text"
              value={unitSuffix}
              onChange={(e) => {
                const sanitized = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "").slice(0, 1);
                setUnitSuffix(sanitized);
              }}
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1 items-center gap-1">
            Comments
            <InfoTip message="Anything else you'd like to share about your roommate experience?" />
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            required
            className="w-full border rounded-md p-2 h-32"
            placeholder="Share your experience..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
