"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";
import Loading from "@/components/Loading";

export default function AddHousingPage() {
  const router = useRouter();
  const { user } = useUser();

  // State management for form inputs and loading states
  const [housingName, setHousingName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSchool, setIsLoadingSchool] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user's school information on component mount
  useEffect(() => {
    const fetchSchool = async () => {
      if (!user?.id) return;

      const res = await fetch(`/api/user-info?user_id=${user.id}`);
      const data = await res.json();

      if (res.ok && data.school_name) {
        setSchoolName(data.school_name);
      }

      setIsLoadingSchool(false);
    };

    fetchSchool();
  }, [user]);

  // Clear messages when user types
  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
  }, [housingName]);

  // Handle form submission to create new housing
  const handleSubmit = async () => {
    if (!user?.id || !housingName.trim()) {
      setErrorMessage("Please enter a housing name.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Submit housing creation request to API
    const res = await fetch("/api/housing/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        housing_name: housingName.trim(),
        user_id: user.id,
      }),
    });

    const result = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      // Handle duplicate housing case
      if (res.status === 409 && result.is_existing) {
        setErrorMessage(`Housing "${result.duplicate_name}" already exists for this school.`);
      } else {
        setErrorMessage(result.error || "Failed to add housing. Please try again.");
      }
      return;
    }

    // Success case
    setSuccessMessage("Housing created successfully!");
    
    // Extract housing ID from response and redirect to housing detail page
    const housingId = result.data?.[0]?.housing_id;

    if (!housingId) {
      setErrorMessage("Housing added, but could not retrieve ID.");
      return;
    }

    // Redirect after a short delay to show success message
    setTimeout(() => {
      router.push(`/housing/${housingId}`);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem] relative">
      <TopFridge showSearchBar={true} back={true}>
        <AuthHeader />

        {isLoadingSchool ? (
          <Loading text="Loading" />
        ) : (
          <div className="flex flex-col items-center mt-[13rem] font-lazyDog">
            <h1 className="w-1/2 text-[2rem] text-darkBlue text-center leading-none">
              Add a New Housing Option
            </h1>
            <p className="w-1/2 text-darkBlue text-center mt-4">
              @ <strong>{schoolName}</strong>
            </p>

            {/* Housing Name Input Field */}
            <input
              type="text"
              placeholder="Housing name"
              value={housingName}
              onChange={(e) => setHousingName(e.target.value)}
              className="w-1/3 p-3 border border-darkBlue rounded-md mb-4 mt-8"
            />

            {/* Error Message Display */}
            {errorMessage && (
              <div className="w-1/3 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                {errorMessage}
              </div>
            )}

            {/* Success Message Display */}
            {successMessage && (
              <div className="w-1/3 mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-1/3 bg-darkBlue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Housing"}
            </button>
          </div>
        )}
      </TopFridge>
    </main>
  );
}
