import RoommateDetails from "@/components/RoommateDetailsClient";

// app/roommate/[id]/page.tsx
export default async function RoommatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params to get the actual id
  const { id } = await params;
  return <RoommateDetails />;
}