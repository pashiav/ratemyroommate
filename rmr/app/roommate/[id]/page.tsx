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
// app/roommate/[id]/page.tsx

import { Suspense } from 'react';
import RoommateDetails from './roommate-details-client';

interface PageParams {
  id: string;
}

export default function RoommatePage({ params }: { params: PageParams }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoommateDetails id={params.id} />
    </Suspense>
  );
}