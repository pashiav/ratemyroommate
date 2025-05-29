"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import TopFridge from "@/components/TopFridge";
import AuthHeader from "@/components/AuthHeader";

export default function AddPlacePage() {
  const { isSignedIn, getToken } = useAuth(); // Access isSignedIn and getToken from useAuth
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!isSignedIn) {
      alert("You must be signed in to add a place.");
      return;
    }

    // Retrieve the session token
    const token = await getToken(); // Retrieve the token using getToken

    if (!token) {
      alert("Session token not available");
      return;
    }

    const res = await fetch("/api/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass the token as Bearer
      },
      body: JSON.stringify({ name, school }),
    });

    if (res.ok) {
      const { id } = await res.json(); // 👈 grab the new place's id
      router.push(`/places/${id}`); // 👈 redirect to its page
    } else {
      alert("Error adding place");
    }
  };

  return (
    <main className="min-h-screen bg-[#315d8d] pl-[0.75rem] pr-[0.75rem]">
      <TopFridge showSearchBar={true}>
        <AuthHeader />

        <div className="flex flex-col items-center gap- mt-[13rem]">
          <h1 className="text-[4rem] text-darkBlue text-center leading-none">
            Add a New Place
          </h1>

          <input
            placeholder="Name of apartment/dorm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-1/3 p-3 border border-gray-300 rounded-md mb-4"
          />

          <input
            placeholder="School (optional)"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-1/3 p-3 border border-gray-300 rounded-md mb-4"
          />

          <button
            onClick={handleSubmit}
            className="bg-darkBlue hover:bg-blue-800 text-white px-4 py-2 rounded-md"
          >
            Add Place
          </button>
        </div>
      </TopFridge>
    </main>
  );
}
