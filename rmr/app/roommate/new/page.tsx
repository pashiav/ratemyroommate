// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
// import TopFridge from "@/components/TopFridge";
// import AuthHeader from "@/components/AuthHeader";

// export default function AddRoommatePage() {
//   const router = useRouter();
//   const { isSignedIn } = useUser();
//   const [name, setName] = useState("");
//   const [unitEnding, setUnitEnding] = useState("");
//   const [school, setSchool] = useState(""); // Add state for school
//   const [places, setPlaces] = useState<any[]>([]);
//   const [selectedPlace, setSelectedPlace] = useState("");

//   useEffect(() => {
//     // Fetch available places from the backend
//     const fetchPlaces = async () => {
//       const res = await fetch("/api/places");
//       const data = await res.json();
//       setPlaces(data);
//     };

//     fetchPlaces();
//   }, []);

//   const handleSubmit = async () => {
//     const payload = {
//       name,
//       unitEnding,
//       placeId: selectedPlace,
//     };

//     // Only add school if it's not empty
//     if (school.trim()) {
//       Object.assign(payload, { school });
//     }

//     const res = await fetch("/api/roommates", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (res.ok) {
//       router.push("/search");
//     } else {
//       const errorData = await res.json();
//       alert(`Failed to add roommate: ${errorData.error || "Unknown error"}`);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#315d8d] pl-4 pr-4">
//       <TopFridge showSearchBar={true}>
//         <AuthHeader />

//         <div className="flex flex-col items-center gap- mt-[13rem] font-lazyDog">
//           <h1 className="text-[4rem] font-lazyDog text-darkblue text-center leading-none">
//             Add a New Roommate
//           </h1>

//           {/* Name */}
//           <input
//             type="text"
//             placeholder="Roommate name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-1/3 p-3 border border-darkblue rounded-md mb-4 mt-8"
//           />

//           {/* Unit Ending */}
//           <input
//             type="text"
//             placeholder="Unit ending (e.g. 204)"
//             value={unitEnding}
//             onChange={(e) => setUnitEnding(e.target.value)}
//             className="w-1/3 p-3 border border-darkblue rounded-md mb-4"
//           />

//           {/* School (Optional) */}
//           <input
//             type="text"
//             placeholder="School (optional)"
//             value={school}
//             onChange={(e) => setSchool(e.target.value)}
//             className="w-1/3 p-3 border border-darkblue rounded-md mb-4"
//           />

//           {/* Apartment/Dorm Select */}
//           <select
//             value={selectedPlace}
//             onChange={(e) => {
//               const value = e.target.value;
//               if (value === "add-new") {
//                 router.push("/place/new");
//               } else {
//                 setSelectedPlace(value);
//               }
//             }}
//             className="w-1/3 p-3 border border-darkblue rounded-md mb-4"
//           >
//             <option value="">Select Apartment/Dorm</option>
//             {places.map((place) => (
//               <option key={place.places_id} value={place.places_id}>
//                 {place.name}
//               </option>
//             ))}
//             <option value="add-new">+ Add New Place</option>
//           </select>

//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             className="w-1/3 bg-darkblue text-white font-semibold py-2 px-4 rounded-md hover:transition hover:bg-blue-800"
//           >
//             Add Roommate
//           </button>
//         </div>
//       </TopFridge>
//     </main>
//   );
// }
