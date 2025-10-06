"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Loading from "@/components/Loading";

// Props interface for the review form component
interface ReviewFormProps {
  roommate_id: string;
}

// Interface for housing data structure
interface HousingViewResult {
  housing_id: string;
  housing_name: string;
  is_verified: boolean;
}

// Info tip component for form field help text
function InfoTip({ message }: { message: string }) {
  return (
    <span className="relative group ml-1 sm:ml-2 cursor-pointer text-gray-500 text-sm sm:text-base">
      ⓘ
      <div className="absolute z-10 hidden group-hover:block bg-white text-darkBlue text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 rounded border-2 border-gray-200 shadow-lg top-full left-1/2 transform -translate-x-1/2 mt-1 w-48 sm:w-64 whitespace-pre-line">
        {message}
      </div>
    </span>
  );
}

export default function ReviewForm({ roommate_id }: ReviewFormProps) {
  const router = useRouter();
  const { userId, getToken, isLoaded, isSignedIn } = useAuth();

  // Form state management for all review fields
  const [rating, setRating] = useState(5);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [petFriendly, setPetFriendly] = useState("");
  const [hasPets, setHasPets] = useState<boolean | null>(null);
  const [yearsLived, setYearsLived] = useState("");
  const [comments, setComments] = useState("");

  // Numeric rating fields for roommate attributes
  const [noiseLevel, setNoiseLevel] = useState(3);
  const [cleanliness, setCleanliness] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [responsibility, setResponsibility] = useState(3);

  // Lifestyle compatibility fields
  const [sleepPattern, setSleepPattern] = useState("");
  const [guestFrequency, setGuestFrequency] = useState("");
  const [studyCompatibility, setStudyCompatibility] = useState("");

  // Housing and pet-related fields
  const [unitSuffix, setUnitSuffix] = useState("");
  const [petType, setPetType] = useState("");
  const [petImpact, setPetImpact] = useState("");

  // Form submission and UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Housing options for the form
  const [housingOptions, setHousingOptions] = useState<HousingViewResult[]>([]);
  const [housingId, setHousingId] = useState("");

  // Fetch available housing options on component mount
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

  // State for displaying roommate name
  const [roommateName, setRoommateName] = useState<string>("");

  // Fetch roommate name for display purposes
  useEffect(() => {
    async function fetchRoommateName() {
      try {
        const res = await fetch(`/api/roommates/${roommate_id}/name`);
        const data = await res.json();

        if (!res.ok || !data.full_name) {
          throw new Error("Roommate not found");
        }

        setRoommateName(data.full_name);

        setRoommateName(data.full_name);
      } catch (err) {
        console.error("Failed to fetch roommate name", err);
        setRoommateName("Unknown Roommate");
      }
    }

    fetchRoommateName();
  }, [roommate_id]);

  // Handle form submission to create new review
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn || !userId) {
      setError("You must be signed in to leave a review");
      return;
    }

    // Validate required fields
    const missingFields: string[] = [];
    
    if (wouldRecommend === null) missingFields.push("Would you recommend");
    if (!yearsLived) missingFields.push("Years Lived");
    if (!sleepPattern) missingFields.push("Sleep Pattern");
    if (!guestFrequency) missingFields.push("Guest Frequency");
    if (!studyCompatibility) missingFields.push("Study Compatibility");
    if (!petFriendly) missingFields.push("Pet Friendly");
    if (hasPets === null) missingFields.push("Pets");
    if (!housingId) missingFields.push("Housing");
    if (!unitSuffix.trim()) missingFields.push("Unit/Apt");
    if (!comments.trim()) missingFields.push("Comments");

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(", ")}`);
      setSuccessMessage(null);
      // Scroll to error message
      window.scrollTo({ top: document.getElementById('submit-section')?.offsetTop! - 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = await getToken();
      // Submit review data to API
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
          unit_suffix: unitSuffix,
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
      // Redirect to roommate profile page after successful submission
      setTimeout(() => {
        router.push(
          `/roommate/${roommate_id}?housing_id=${housingId}&unit_suffix=${unitSuffix}`
        );
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

  // Show loading state while Clerk is initializing
  if (!isLoaded || !isSignedIn) return <Loading text="Loading" />;

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-gray-200 border-2 sm:border-4 w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[55%] mx-auto">
      {/* Form Header with Roommate Name */}
      <h1 className="text-xl sm:text-2xl md:text-[1.75rem] font-bold mb-4 sm:mb-6">
        Leave a Review for{" "}
        <span className="text-darkBlue">{roommateName || "Roommate..."}</span>
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Overall Rating Section */}
        <div>
          <label className="block text-gray-700 text-base sm:text-lg mb-2">
            Rating
            <InfoTip message="Overall roommate experience. 1 = very poor, 5 = excellent." />
          </label>
          <div className="flex mb-4 sm:mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none mr-1"
                aria-label={`Rate ${star} stars`}
              >
                <svg
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${star <= rating ? "text-gold" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 self-center text-gray-600 text-sm sm:text-base">{rating}/5</span>
          </div>
        </div>

        {/* Recommendation Section */}
        <div>
          <label className="block font-medium mb-1 items-center gap-1 text-sm sm:text-base">
            Would you recommend?
            <InfoTip message="Would you live with this person again or recommend them to someone else?" />
          </label>
          <div className="flex gap-3 sm:gap-4">
            <button
              type="button"
              className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${wouldRecommend === true ? "bg-lightBlue text-white" : "bg-gray-200"}`}
              onClick={() => setWouldRecommend(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${wouldRecommend === false ? "bg-lightBlue text-white" : "bg-gray-200"}`}
              onClick={() => setWouldRecommend(false)}
            >
              No
            </button>
          </div>
        </div>
        
        {/* Numeric Rating Grid for Roommate Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6">
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
              <label className="block font-medium mb-1 items-center gap-1 text-sm sm:text-base">
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
                <span className="text-sm text-gray-600 font-semibold whitespace-nowrap">
                  {value}/5
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lifestyle Compatibility Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 mt-4 sm:mt-6">
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
              <label className="block font-medium mb-1 items-center gap-1 text-sm sm:text-base">
                {label}
                <InfoTip message={tip} />
              </label>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                className="w-full border rounded-md p-2 text-sm sm:text-base"
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
        
        {/* Pet Friendliness Section */}
        <div>
          <label className="block font-medium mb-1 items-center gap-1 text-sm sm:text-base">
            Pet Friendly?
            <InfoTip message="Were they kind, respectful, and accommodating to pets — regardless of whether they had one?" />
          </label>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {["yes", "no", "n/a"].map((option) => (
              <button
                key={option}
                type="button"
                className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${
                  petFriendly === option
                    ? "bg-lightBlue text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setPetFriendly(option)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Pet Ownership Section */}
        <div>
          <label className="block font-medium mb-1 items-center gap-1 text-sm sm:text-base">
            Pets?
            <InfoTip message="Did this roommate have any pets?" />
          </label>
          <div className="flex gap-3 sm:gap-4">
            <button
              type="button"
              className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${hasPets === true ? "bg-lightBlue text-white" : "bg-gray-200"}`}
              onClick={() => setHasPets(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${hasPets === false ? "bg-lightBlue text-white" : "bg-gray-200"}`}
              onClick={() => setHasPets(false)}
            >
              No
            </button>
          </div>
        </div>

        {/* Conditional Pet Details Section */}
        {hasPets && (
          <div className="border border-blue-400 bg-blue-50 p-3 sm:p-4 rounded-xl space-y-3 sm:space-y-4 mt-4">
            <div>
              <label className="block font-medium mb-1 items-center gap-1 text-sm sm:text-base">
                Pet Type (Optional)
                <InfoTip message="What kind of pet(s) did they have? (e.g. dog, cat, bird)" />
              </label>
              <input
                type="text"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full border rounded-md p-2 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 items-center gap-1 text-sm sm:text-base">
                Pet Impact (Optional)
                <InfoTip message="How much did the pet(s) affect your living experience?" />
              </label>
              <select
                value={petImpact}
                onChange={(e) => setPetImpact(e.target.value)}
                className="w-full border rounded-md p-2 text-sm sm:text-base"
              >
                <option value="">Select</option>
                <option value="minimal">Minimal</option>
                <option value="moderate">Moderate</option>
                <option value="significant">Significant</option>
              </select>
            </div>
          </div>
        )}

        {/* Housing and Unit Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-medium items-center gap-1 text-sm sm:text-base">
                Where did you live together?
                <InfoTip message="Select the housing where you and this roommate lived." />
              </label>
              <button
                type="button"
                onClick={async (e) => {
                  const target = e.currentTarget;
                  target.classList.add('animate-spin');
                  const res = await fetch("/api/housing", { cache: "no-store" });
                  const data = await res.json();
                  setHousingOptions(data);
                  target.classList.remove('animate-spin');
                }}
                className="text-xl text-lightBlue hover:text-blue-900 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer bg-blue-50 hover:bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
                title="Refresh housing list"
              >
                ↻
              </button>
            </div>
            <select
              value={housingId}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "__add_new__") {
                  // Open new housing form in new tab
                  window.open("/housing/new", "_blank");
                  // Reset selection
                  setHousingId("");
                } else {
                  setHousingId(value);
                }
              }}
              required
              className="w-full border rounded-md p-2 text-sm sm:text-base mb-2"
            >
              <option value="">Select housing</option>
              {housingOptions.map((h) => (
                <option key={h.housing_id} value={h.housing_id}>
                  {h.housing_name} {h.is_verified ? "" : ""}
                </option>
              ))}
              <option value="__add_new__" className="text-lightBlue font-medium">
                + Don't see your housing? Add it here
              </option>
            </select>
            
          </div>

          <div>
            <label className="block font-medium mb-1 items-center gap-1 text-sm sm:text-base">
              Unit End #...?
              <InfoTip message={"e.g. Unit #993C → C\ne.g. Unit #2 → 2"} />
            </label>
            <input
              type="text"
              value={unitSuffix}
              required
              onChange={(e) => {
                // Sanitize input to only allow alphanumeric characters, max 1 character
                const sanitized = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "")
                  .slice(0, 1);
                setUnitSuffix(sanitized);
              }}
              className="w-full border rounded-md p-2 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <label className="block font-medium mb-1 items-center gap-1 text-sm sm:text-base">
            Comments
            <InfoTip message="Anything else you'd like to share about your roommate experience?" />
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            required
            className="w-full border rounded-md p-2 h-24 sm:h-32 text-sm sm:text-base"
            placeholder="Share your experience..."
          />
        </div>

        {/* Messages Section - Show above submit button for better UX */}
        <div id="submit-section">
          {successMessage && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 sm:p-4">
              <p className="text-green-700 font-semibold text-sm sm:text-base text-center">
                ✓ {successMessage}
              </p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 sm:p-4">
              <p className="text-red-700 font-semibold text-sm sm:text-base text-center">
                ✗ {error}
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 sm:py-3 rounded-md bg-lightBlue text-white hover:bg-blue-800 disabled:opacity-50 border-r-4 border-b-4 border-darkBlue transition duration-200 text-sm sm:text-base font-medium"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
