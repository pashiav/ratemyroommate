"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs"; // Import useAuth hook

export default function AddPlacePage() {
  const { isSignedIn, getToken } = useAuth();  // Access isSignedIn and getToken from useAuth
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
        "Authorization": `Bearer ${token}`,  // Pass the token as Bearer
      },
      body: JSON.stringify({ name, school }),
    });

    if (res.ok) {
      router.push("/roommate/new"); // 👈 Go back to form
    } else {
      alert("Error adding place");
    }
  };

  return (
    <main className="min-h-screen bg-[#315d8d] pl-4 pr-4">
      <div className="bg-[#f5f5f5] rounded-[96px] shadow-lg p-8 min-h-screen">
        {/* Fridge handle */}
        <img
          src="/handle.png"
          alt="Fridge Handle"
          className="absolute left-0 ml-24 top-[7.5rem] w-36 h-auto object-contain"
        />

        {/* shineeeee left */}
        <img
          src="/shine-left-crop.png"
          alt="shine"
          className="absolute left-0 top-0 mt-1 ml-6 w-xs h-auto object-cover"
        />
        {/* shineeeee right */}
        <img
          src="/shine-right-crop.png"
          alt="shine"
          className="absolute right-0 top-0 mt-1 mr-6 w-xs h-auto object-cover"
        />


      <div className="flex flex-col items-center gap- mt-[13rem] font-lazyDog">
      <h1 className="text-[4rem] font-lazyDog text-darkblue text-center leading-none">Add a New Place</h1>

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
          className="bg-darkblue hover:bg-blue-800 text-white px-4 py-2 rounded-md"
        >
          Add Place
        </button>
      </div>

      </div>
    </main>
  );
}
