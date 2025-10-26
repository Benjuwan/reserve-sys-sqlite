import Rooms from "../components/rooms/Rooms";
import Calendar from "../components/schedule/calendar/Calendar";

export default async function Home() {
  /* 418 hydration-error 対策： サーバーサイドで必要な日付情報を取得してクライアントコンポーネント（子`Rooms`）に`props`として渡す */
  // 当年当月の「0日目」を取得（翌月の0日＝当月の最終日）し、その日付（最終日）を出す 
  // 例：const thisLastDay = new Date(2025, 6, 0).getDate() 
  const theThisLastDay: number = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const theToday: number = new Date().getDate();

  return (
    <main>
      <h1>会議室予約システム</h1>
      <Rooms props={{
        theThisLastDay: theThisLastDay,
        theToday: theToday
      }} />
      <Calendar />
    </main>
  );
}
