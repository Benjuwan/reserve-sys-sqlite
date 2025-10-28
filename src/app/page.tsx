import Rooms from "../components/rooms/Rooms";
import Calendar from "../components/schedule/calendar/Calendar";

export default async function Home() {
  /* 418 hydration-error 対策：
    - 【原因】：デプロイ先（Vercel）のタイムゾーンが日本時間でないことによる時差発生
    - 【対応】：サーバーコンポーネントで日付データを取得して子に渡す 
  */
  // デプロイ先のタイムゾーン設定がUTCの場合に備えてJSTの日付（今日・本日）を取得
  const jst: Date = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const theToday: number = jst.getDate();

  return (
    <main>
      <h1>会議室予約システム</h1>
      <Rooms theToday={theToday} />
      <Calendar />
    </main>
  );
}