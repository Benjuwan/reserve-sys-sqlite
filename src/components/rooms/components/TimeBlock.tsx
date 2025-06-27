import { memo, useMemo } from "react";
import { todoItemType } from "../../schedule/todoItems/ts/todoItemType";

type TimeBlockType = {
    room: string;
    timeBlock: number;
    todoMemo: todoItemType[];
    ctrlMultiTimeTable: number;
};

const useCreateTimeTableViewDay: (ctrlMultiTimeTable: number) => string = (ctrlMultiTimeTable: number) => {
    const thisYear: number = new Date().getFullYear();
    const thisMonth: number = new Date().getMonth() + 1;

    // 当年当月の「0日目」を取得（翌月の0日＝当月の最終日）し、その日付（最終日）を出す
    const thisLastDay = new Date(thisYear, thisMonth, 0).getDate();

    // 最終週かどうか判定
    const isLastWeek: boolean = new Date().getDate() > (thisLastDay - 7);

    const theTimeTableViewDay: string = useMemo(() => {
        return `${thisYear}/${isLastWeek && ctrlMultiTimeTable < 7 ? thisMonth + 1 : thisMonth}/${ctrlMultiTimeTable}`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctrlMultiTimeTable]);

    return theTimeTableViewDay;
}

function TimeBlock({ props }: { props: TimeBlockType }) {
    const { room, timeBlock, todoMemo, ctrlMultiTimeTable } = props;

    const minBlocks: number[] = [];
    for (let i = 1; i <= 59; i++) minBlocks.push(i);

    const theTimeTableViewDay: string = useCreateTimeTableViewDay(ctrlMultiTimeTable);

    // useMemo を使用した動的な予約情報（当日より1週間分の各部屋ごとのタイムテーブル配列）の取得 
    const relevantReservations: todoItemType[] = useMemo(() => {
        return [...todoMemo].filter(memo =>
            (memo.todoID === theTimeTableViewDay) &&
            (typeof memo.rooms !== 'undefined' && memo.rooms === room)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todoMemo, room, ctrlMultiTimeTable]);

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