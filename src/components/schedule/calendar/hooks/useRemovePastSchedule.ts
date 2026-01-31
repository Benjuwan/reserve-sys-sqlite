import { todoItemType } from "../../todoItems/ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom } from "@/types/calendar-atom";
import { useDeleteTodoItem } from "../../todoItems/hooks/useDeleteTodoItem";

export const useRemovePastSchedule = () => {
    const [, setTodoMemo] = useAtom(todoMemoAtom);
    const { deleteReservation } = useDeleteTodoItem();

    const removePastSchedule: (fetchTodoMemo: todoItemType[]) => void = (fetchTodoMemo: todoItemType[]) => {
        if (fetchTodoMemo.length > 0) {
            // 現在の UTC 時刻を取得し、日本時間（UTC+9時間）に変換
            const now = new Date();
            const jstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));

            // 日本時間での今日の日付（YYYY-MM-DD形式）
            const year = jstTime.getUTCFullYear();
            const month = String(jstTime.getUTCMonth() + 1).padStart(2, '0');
            const date = String(jstTime.getUTCDate()).padStart(2, '0');
            const todayJST = `${year}-${month}-${date}`;

            const exceptPastTodoMemos: todoItemType[] = [...fetchTodoMemo].filter(memo => {
                // memo.todoID を YYYY-MM-DD 形式に変換
                const memoDateStr = memo.todoID.split('/').map((d, i) => {
                    if (i !== 0) {
                        return d.toString().padStart(2, '0');
                    } else {
                        return d;
                    }
                }).join('-');

                // 文字列比較で判定（YYYY-MM-DD形式なら辞書順で比較可能）
                if (memoDateStr >= todayJST) {
                    return true;
                } else {
                    /* 過去分はDBから削除 */
                    console.warn("▼ 過去判定による削除対象スケジュール");
                    console.warn(memo);
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