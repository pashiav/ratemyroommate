// import { Suspense } from "react";
// import { useRouter } from "next/navigation";
// import RoommateDetails from "./roommate-details-client";

// export default async function RoommatePage({ params }: { params: { id: string } }) {
//   const { id } = await params;  // Make sure params are awaited
  
//   return (
//     <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
//       <RoommateDetails id={id} />
//     </Suspense>
//   );
// }
import RoommateDetails from './roommate-details-client';

export default function RoommatePage({ params }: { params: { id: string } }) {
  return <RoommateDetails id={params.id} />;
}