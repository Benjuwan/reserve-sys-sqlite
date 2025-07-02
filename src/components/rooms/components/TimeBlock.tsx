import { memo, useMemo } from "react";
import { todoItemType } from "../../schedule/todoItems/ts/todoItemType";
import { useTimeBlock } from "../hooks/useTimeBlock";

type TimeBlockType = {
    room: string;
    timeBlock: number;
    todoMemo: todoItemType[];
    ctrlMultiTimeTable: number;
};

function TimeBlock({ props }: { props: TimeBlockType }) {
    const { room, timeBlock, todoMemo, ctrlMultiTimeTable } = props;

    const minBlocks: number[] = [];
    for (let i = 1; i <= 59; i++) minBlocks.push(i);

    const { useCreateTimeTableViewDay, checkReservedFlag, checkLast15 } = useTimeBlock();

    const theTimeTableViewDay: string = useCreateTimeTableViewDay(ctrlMultiTimeTable);

    // useMemo を使用した動的な予約情報（当日より1週間分の各部屋ごとのタイムテーブル配列）の取得 
    const relevantReservations: todoItemType[] = useMemo(() => {
        return [...todoMemo].filter(memo =>
            (memo.todoID === theTimeTableViewDay) &&
            (typeof memo.rooms !== 'undefined' && memo.rooms === room)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todoMemo, room, ctrlMultiTimeTable]);

    return (
        <>
            {minBlocks.map(minBlock => {
                const isReserved: boolean = checkReservedFlag(relevantReservations, timeBlock, minBlock);
                const isLast15: boolean = checkLast15(relevantReservations, timeBlock, minBlock);

                return (
                    <div
                        key={minBlock}
                        data-minblock={minBlock}
                        data-reserved={isReserved}
                        data-last15={isReserved && isLast15}
                    >&nbsp;</div>
                )
            })}
        </>
    );
}

export default memo(TimeBlock);