import { memo, useMemo } from "react";
import { todoItemType } from "../../schedule/todoItems/ts/todoItemType";

type TimeBlockType = {
    room: string;
    timeBlock: number;
    todoMemo: todoItemType[];
}

function TimeBlock({ props }: { props: TimeBlockType }) {
    const { room, timeBlock, todoMemo } = props;

    const minBlocks: number[] = [];
    for (let i = 1; i <= 59; i++) minBlocks.push(i);

    const today: string = useMemo(() => `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`, []);

    // useMemo を使用した動的な予約情報（当日限定及び各部屋ごとのタイムテーブル配列）の取得 
    const relevantReservations: todoItemType[] = useMemo(() => {
        return [...todoMemo].filter(memo =>
            (memo.todoID === today) &&
            (typeof memo.rooms !== 'undefined' && memo.rooms === room)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todoMemo, room]);

    // some 処理によって一つでも true なら true が返却される
    const reservedFlag: (timeBlock: number, minBlock: number) => boolean = (timeBlock: number, minBlock: number) => {
        return relevantReservations.some(reservation => {
            const theTime = parseInt(`${timeBlock}${minBlock.toString().padStart(2, '0')}`);
            const start = parseInt(reservation.startTime?.split(':').join('') ?? '0');
            const finish = parseInt(reservation.finishTime?.split(':').join('') ?? '0');
            return theTime >= start && theTime <= finish;
        });
    };

    return (
        <>
            {minBlocks.map(minBlock => (
                <div
                    key={minBlock}
                    data-minblock={minBlock}
                    data-reserved={reservedFlag(timeBlock, minBlock)}
                >&nbsp;</div>
            ))}
        </>
    );
}

export default memo(TimeBlock);