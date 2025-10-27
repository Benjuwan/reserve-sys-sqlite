import Rooms from "../components/rooms/Rooms";
import Calendar from "../components/schedule/calendar/Calendar";

export default async function Home() {
  return (
    <main>
      <h1>会議室予約システム</h1>
      <Rooms />
      <Calendar />
    </main>
  );
}