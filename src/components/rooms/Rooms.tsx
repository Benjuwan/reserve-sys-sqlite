"use client"

import { memo } from "react";
import roomStyle from "./styles/roomstyle.module.css";
import { useAtom } from "jotai";
import { roomsAtom } from "@/types/rooms-atom";
import { todoMemoAtom } from "@/types/calendar-atom";
import TimeTable from "./components/TimeTable";

function Rooms() {
    const [rooms] = useAtom(roomsAtom);

    /**
     * 以下のエラー（Atom 呼び出しがループしている）対策として親元コンポーネントで当該Atomを読み込んで props drilling（propsのバケツリレー）する
     * React Hook "useAtom" may be executed more than once. Possibly because it is called in a loop. React Hooks must be called in the exact same order in every component render.
    */
    const [todoMemo] = useAtom(todoMemoAtom);

    return (
        <section>
            {rooms.map((room, i) => (
                <div key={i} className={roomStyle.roomContainer}>
                    <p>{room.room}</p>
                    <div className={roomStyle.timeScheduleWrapper}>
                        <TimeTable room={room.room} todoMemo={todoMemo} />
                    </div>
                </div>
            ))}
        </section>
    );
}

export default memo(Rooms);