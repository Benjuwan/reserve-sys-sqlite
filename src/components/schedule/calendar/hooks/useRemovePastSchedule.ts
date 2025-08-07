import { todoItemType } from "../../todoItems/ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom } from "@/types/calendar-atom";
import { useDeleteTodoItem } from "../../todoItems/hooks/useDeleteTodoItem";
import { useEffect, useState } from "react";

export const useRemovePastSchedule = () => {
    const [, setTodoMemo] = useAtom(todoMemoAtom);
    const { deleteReservation } = useDeleteTodoItem();

    /* 418 hydration-error 対策 */
    const init_present: Date = new Date();
    const [compareTarget_present, setPresent] = useState<Date>(init_present);
    useEffect(() => {
        const rendered_present: Date = new Date();
        setPresent(rendered_present);
    }, []);

    const removePastSchedule: (isMounted: boolean, fetchTodoMemo: todoItemType[]) => void = (
        isMounted: boolean,
        fetchTodoMemo: todoItemType[]
    ) => {
        if (isMounted && fetchTodoMemo.length > 0) {

            // Day（曜日） Month（月） Date（日付） year（年） 09:00:00 GMT+0900 (GMT+09:00)
            compareTarget_present.setHours(9, 0, 0, 0);

            const exceptPastTodoMemos: todoItemType[] = [...fetchTodoMemo].filter(memo => {
                /* compareTarget_present と「同じ記述及び文字列型にする」ための整形処理 */
                const adjustMemoTimeData: string = memo.todoID.split('/').map((d, i) => {
                    if (i !== 0) {
                        // 月日のみ「-MM, -DD」の形に整形（※出力結果は YYYY-MM-DD ）
                        return `-${d.toString().padStart(2, '0')}`;
                    } else {
                        return d;
                    }
                }).join('');

                const compareTarget_memoDate: Date = new Date(adjustMemoTimeData);

                if (compareTarget_memoDate >= compareTarget_present) {
                    return true;
                } else {
                    /* 過去分はDBから削除 */
                    deleteReservation(memo.id);
                    return false; // 明示的に false を返す
                }
            });

            /* 当日以降の予定のみスケジュールとして管理・把握 */
            setTodoMemo(exceptPastTodoMemos);
        }
    }

    return { removePastSchedule }
}