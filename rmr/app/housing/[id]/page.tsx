"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";

interface HousingViewResult {
  housing_id: string;
  housing_name: string;
  school_name: string;
  is_verified: boolean;
  latitude?: number;
  longitude?: number;
}

export default function HousingDetailClient() {
  const { id } = useParams();
  const [data, setData] = useState<HousingViewResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHousing = async () => {
      try {
        const res = await fetch(`/api/housing/${id}`, { cache: "no-store" });
        if (!res.ok) {
          setError(true);
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError(true);
      }
    };

    fetchHousing();
  }, [id]);

  if (error || !data) {
    return <p className="p-10 text-center">Housing not found or loading failed.</p>;
  }

  return (
    <main className="min-h-screen bg-white px-8 py-16 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">{data.housing_name}</h1>
        <p className="text-lg mb-4">School: <strong>{data.school_name}</strong></p>

        {data.is_verified ? (
          <span className="text-green-600 font-bold">Verified</span>
        ) : (
          <span className="text-red-600 font-bold">Not Verified</span>
        )}

        {(data.latitude && data.longitude) && (
          <div className="mt-6">
            <p>Coordinates:</p>
            <p className="text-sm text-gray-700">
              Latitude: {data.latitude}, Longitude: {data.longitude}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
