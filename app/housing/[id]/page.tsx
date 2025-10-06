"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import TopFridge from "@/components/TopFridge";
import BottomFridge from "@/components/BottomFridge";
import Footer from "@/components/Footer";
import AuthHeader from "@/components/AuthHeader";

// Interface defining the structure of housing data from API
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
  // State management for housing data and error handling
  const [data, setData] = useState<HousingViewResult | null>(null);
  const [error, setError] = useState(false);

  // Fetch housing details from API on component mount
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

  // Show error message if housing not found or loading failed
  if (error || !data) {
    return (
      <AuthGuard>
        <main className="min-h-screen bg-[#315d8d] px-3 sm:px-4 md:pl-[0.75rem] md:pr-[0.75rem]">
          <TopFridge showSearchBar={true} back={true}>
            <AuthHeader />
            <div className="flex items-center justify-center mt-32">
              <p className="text-white text-xl">Housing not found or loading failed.</p>
            </div>
          </TopFridge>
          <Footer />
        </main>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#315d8d] px-3 sm:px-4 md:pl-[0.75rem] md:pr-[0.75rem]">
        <TopFridge showSearchBar={true} back={true}>
          <AuthHeader />
          <div className="max-w-3xl mx-auto mt-20 sm:mt-24 md:mt-32">
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border-4 border-darkBlue shadow-lg">
              {/* Housing Name Header */}
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-darkBlue font-lazyDog">{data.housing_name}</h1>
              {/* School Information */}
              <p className="text-lg sm:text-xl mb-4 text-gray-700">School: <strong className="text-darkBlue">{data.school_name}</strong></p>

              {/* Verification Status Display */}
              <div className="mb-4">
                {data.is_verified ? (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">✓ Verified</span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold text-sm">Not Verified</span>
                )}
              </div>

              {/* Location Coordinates Display (if available) */}
              {(data.latitude && data.longitude) && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-darkBlue mb-2">Location Coordinates:</p>
                  <p className="text-sm text-gray-700">
                    Latitude: {data.latitude}, Longitude: {data.longitude}
                  </p>
                </div>
              )}
            </div>
          </div>
        </TopFridge>
        <Footer />
      </main>
    </AuthGuard>
  );
}
