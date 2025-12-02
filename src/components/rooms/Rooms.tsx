"use client"

import { memo, useState } from "react";
import roomStyle from "./styles/roomstyle.module.css";
import { useAtom } from "jotai";
import { roomsAtom, roomsInfoToolTipAtom } from "@/types/rooms-atom";
import { todoMemoAtom } from "@/types/calendar-atom";
import About from "../common/About";
import TimeTable from "./components/TimeTable";
import MultiTimeTableCtrlBtns from "./components/MultiTimeTableCtrlBtns";

function RoomsAboutViewer() {
    const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
    const aboutLightBox: () => void = () => {
        setIsAboutOpen(!isAboutOpen);
    }

    return (
        <div className={isAboutOpen ? `${roomStyle.aboutContainer} ${roomStyle.onView}` : roomStyle.aboutContainer} onClick={aboutLightBox}>
            <h2>◎ 使い方の説明や注意事項</h2>
            <section><About /></section>
        </div>
    );
}

function Rooms({ theToday }: { theToday: number }) {
    const [rooms] = useAtom(roomsAtom);

    /**
     * 以下のエラー（Atom 呼び出しがループしている）対策として親元コンポーネントで当該Atomを読み込んで props drilling（propsのバケツリレー）する
     * React Hook "useAtom" may be executed more than once. Possibly because it is called in a loop. React Hooks must be called in the exact same order in every component render.
    */
    const [todoMemo] = useAtom(todoMemoAtom);
    const [roomsInfo] = useAtom(roomsInfoToolTipAtom);

    // 当月の最終日を取得する固定値
    const theThisLastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    /* 418 hydration-error 対策：
      - 【原因】：デプロイ先（Vercel）のタイムゾーンが日本時間でないことによる時差発生

      - 以前はハイドレーション対策で、`useEffect`内で各種日付データのState更新を行っていたが、Next16へのアップグレードに伴う Lint設定の更新により**不要なeffect処理であるという Lintの警告が発生**した
      - そのため、親（`src/app/page.tsx`）の**サーバーコンポーネントで日付データ取得を行い、子（このクライアントコンポーネント）に`props`として渡す**処理で対応
      - しかし、この実装だと**デプロイ後はSSGモデリングとなって各種日付データが固定値**となってしまうのか、それとも**デプロイ先（Vercel）のタイムゾーンが日本時間でないことが原因**か、またはそれら複合的な要因かによって**時差（午前中から夕方あたりまでは前日表示となる）が生じて**しまう状況になった
      - そのため、`useState`の初期値に「今日・本日」の可変値として`new Date().getDate()`を設定し、**クライアントサイドでマウントされたタイミングで最新の日付データを取得する**形に変更した
      - しかし結局**時間帯（だいたい0時～9時ごろまで）による 418 hydration-error が発生**。親のサーバーコンポーネントでJSTの日付を取得する形に再度変更し、**デプロイ先のタイムゾーン設定がUTCの場合にも対応**した
      
      - **代替案**：
      親（`src/app/page.tsx`）のサーバーコンポーネントで**日本時間を取得する記述（設定）に変更**し、`force-dynamic`宣言による SSR化で常に最新の日付データを子に渡す、というアプローチ。ただし今回は、ページ全体のパフォーマンスに影響が出る可能性があるため`force-dynamic`宣言は採用しなかった。
      
      ```ts
      // ファイルの先頭にSSR宣言を追加
      export const dynamic = 'force-dynamic';

      // デプロイ先のタイムゾーン設定がUTCの場合に備えてJSTの日付を取得
      const jst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
      const theToday = jst.getDate();
      ```
    */

    // タイムテーブルの表示制御に利用するための「今日・本日」の可変値
    const [ctrlMultiTimeTable, setCtrlMultiTimeTable] = useState<number>(theToday);

    return (
        <section className={roomStyle.roomWrapper}>
            {typeof roomsInfo !== 'undefined' &&
                <p className={`roomInfoToolTip ${roomsInfo.length > 0 ?
                    `${roomStyle.roomInfoToolTip} ${roomStyle.onView}` :
                    roomStyle.roomInfoToolTip}`
                }>{roomsInfo}</p>
            }
            <MultiTimeTableCtrlBtns props={{
                ctrlMultiTimeTable: ctrlMultiTimeTable,
                setCtrlMultiTimeTable: setCtrlMultiTimeTable,
                theThisLastDay: theThisLastDay
            }} />
            {rooms.map((room, i) => (
                <div key={i} className={roomStyle.roomContainer}>
                    <p>{room.room}</p>
                    <div className={roomStyle.timeScheduleWrapper}>
                        <TimeTable props={{
                            room: room.room,
                            todoMemo: todoMemo,
                            ctrlMultiTimeTable: ctrlMultiTimeTable
                        }} />
                    </div>
                </div>
            ))}
            <RoomsAboutViewer />
        </section>
    );
}

export default memo(Rooms);