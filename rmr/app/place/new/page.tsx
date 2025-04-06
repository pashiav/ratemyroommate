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
    <main className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-4">Add a New Place</h1>

        <input
          placeholder="Name of apartment/dorm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />

        <input
          placeholder="School (optional)"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Place
        </button>
      </div>
    </main>
  );
}
