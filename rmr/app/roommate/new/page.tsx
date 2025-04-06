"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function AddRoommatePage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [name, setName] = useState("");
  const [unitEnding, setUnitEnding] = useState("");
  const [school, setSchool] = useState(""); // Add state for school
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState("");

  useEffect(() => {
    // Fetch available places from the backend
    const fetchPlaces = async () => {
      const res = await fetch("/api/places");
      const data = await res.json();
      setPlaces(data);
    };

    fetchPlaces();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      name,
      unitEnding,
      placeId: selectedPlace,
    };

    // Only add school if it's not empty
    if (school.trim()) {
      Object.assign(payload, { school });
    }

    const res = await fetch("/api/roommates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/search");
    } else {
      const errorData = await res.json();
      alert(`Failed to add roommate: ${errorData.error || "Unknown error"}`);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      {/* User profile button */}
      <div className="absolute top-4 right-4">
        {isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="bg-navy-blue text-white px-4 py-2 rounded-full hover:bg-navy-blue/90">
              Log In
            </button>
          </SignInButton>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6">Add a New Roommate</h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Roommate name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />

        {/* Unit Ending */}
        <input
          type="text"
          placeholder="Unit ending (e.g. 204)"
          value={unitEnding}
          onChange={(e) => setUnitEnding(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />

        {/* School (Optional) */}
        <input
          type="text"
          placeholder="School (optional)"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        />

        {/* Apartment/Dorm Select */}
        <select
          value={selectedPlace}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "add-new") {
              router.push("/place/new");
            } else {
              setSelectedPlace(value);
            }
          }}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
        >
          <option value="">Select Apartment/Dorm</option>
          {places.map((place) => (
            <option key={place.places_id} value={place.places_id}>
              {place.name}
            </option>
          ))}
          <option value="add-new">+ Add New Place</option>
        </select>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Add Roommate
        </button>
      </div>
    </main>
  );
}