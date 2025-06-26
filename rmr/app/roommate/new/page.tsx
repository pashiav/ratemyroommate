"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";

export default function AddRoommatePage() {
  const router = useRouter();
  const { user } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSchool, setIsLoadingSchool] = useState(true);

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

  const handleSubmit = async () => {
    if (!user?.id || !firstName.trim() || !lastName.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const res = await fetch("/api/roommates/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        user_id: user.id,
      }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const errorData = await res.json();
      alert(`Failed to add roommate: ${errorData.error || "Unknown error"}`);
      return;
    }

    const result = await res.json();
    const roommateId = result.data?.[0]?.rm_id;

    if (!roommateId) {
      alert("Roommate created, but could not get their ID.");
      return;
    }

    router.push(`/roommate/${roommateId}`);
  };

  return (
    <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem] relative">
      <TopFridge showSearchBar={true} back={true}>
        <AuthHeader />

        {isLoadingSchool ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <p className="text-darkBlue text-2xl font-lazyDog">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-[13rem] font-lazyDog">
            <h1 className="w-1/2 text-[2rem] text-darkBlue text-center leading-none">
              Add a New Roommate
            </h1>
            <p className="w-1/2 text-darkBlue text-center mt-4">
              @ <strong>{schoolName}</strong>
            </p>

            {/* First Name */}
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/3 p-3 border border-darkBlue rounded-md mb-4 mt-8"
            />

            {/* Last Name */}
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/3 p-3 border border-darkBlue rounded-md mb-4"
            />

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-1/3 bg-darkBlue text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Roommate"}
            </button>
          </div>
        )}
      </TopFridge>
    </main>
  );
}
