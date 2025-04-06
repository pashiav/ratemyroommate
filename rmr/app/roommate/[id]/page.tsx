// app/roommate/[id]/page.tsx
import RoommateDetails from './roommate-details-client';

export default function RoommatePage(props: any) {
  return <RoommateDetails id={props.params.id} />;
}