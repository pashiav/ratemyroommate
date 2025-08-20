import RoommateDetails from "@/components/RoommateDetailsClient";

// Roommate detail page component - renders the RoommateDetails component
export default async function RoommatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Extract roommate ID from route parameters
  const { id } = await params;
  return <RoommateDetails />;
}