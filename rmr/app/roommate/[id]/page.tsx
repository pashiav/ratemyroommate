import RoommateDetails from "@/components/RoommateDetailsClient";

export default async function RoommatePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <RoommateDetails id={id} />;
}