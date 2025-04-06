import RoommateDetails from './roommate-details-client';

export default function RoommatePage(props: any) {
  // Just pass the ID directly without destructuring
  return <RoommateDetails id={props.params.id} />;
}