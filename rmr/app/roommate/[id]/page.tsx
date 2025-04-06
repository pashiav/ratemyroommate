// app/roommate/[id]/page.tsx
import RoommateDetails from './roommate-details-client';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export default function RoommatePage(props: PageProps) {
  const { id } = props.params;
  
  return <RoommateDetails id={id} />;
}