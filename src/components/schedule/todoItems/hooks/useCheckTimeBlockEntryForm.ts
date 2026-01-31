import { ChangeEvent } from "react";
import { timeBlockBegin, timeBlockEnd } from "@/types/rooms-atom";
import { todoItemType } from "../ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom } from "@/types/calendar-atom";

export const useCheckTimeBlockEntryForm = () => {
    const [todoMemo] = useAtom(todoMemoAtom);

    /* `src/app/types/rooms-atom.ts`で指定した予約受付可能な時間帯かチェック */
    const checkTimeBlockEntryForm: (e: ChangeEvent<HTMLInputElement> | string) => boolean = (
        e: ChangeEvent<HTMLInputElement> | string
    ) => {
        const valueStr: string = typeof e !== 'string' ? e.target.value : e;
        const isNoReservationTime: boolean = parseInt(valueStr) < timeBlockBegin || parseInt(valueStr) >= timeBlockEnd;

        return isNoReservationTime;
    }

    /* 同部屋内・同日での予約時間の重複確認（開始と終了「それぞれ」の予定重複状況をタイムリーにチェック）*/
    const checkTimeSchedule: (targetTime: ChangeEvent<HTMLInputElement> | string, todoItems: todoItemType) => boolean = (
        targetTime: ChangeEvent<HTMLInputElement> | string,
        todoItems: todoItemType
    ) => {
        const theTime: number = typeof targetTime !== 'string' ?
            parseInt(targetTime.target.value.replace(':', '')) :
            parseInt(targetTime.replace(':', ''));

        const isCheckTimeSchedule: boolean = todoMemo.some(memo => {
            const isMatchDay: boolean = memo.todoID === todoItems.todoID;

            if (
                typeof memo.rooms !== 'undefined' &&
                typeof memo.startTime !== 'undefined' &&
                typeof memo.finishTime !== 'undefined'
            ) {
                const isMatchRoom: boolean = typeof todoItems.rooms !== 'undefined' ? memo.rooms === todoItems.rooms : false;

                // 自身が登録した予約時間は検証対象外（編集時の回避措置）
                const isSelf: boolean = todoItems.id === memo.id;
                if (isSelf) {
                    return false;
                }

                const memoStartTime = parseInt(memo.startTime.replace(':', ''));
                const memoFinishTime = parseInt(memo.finishTime.replace(':', ''));

                // 検証対象の時間を設定
                const theStartTime = typeof todoItems.startTime !== 'undefined' ? parseInt(todoItems.startTime.replace(':', '')) : theTime;
                const theFinishTime = typeof todoItems.finishTime !== 'undefined' ? parseInt(todoItems.finishTime.replace(':', '')) : theTime;

                // 時間を4桁文字列（例: 9:45 -> "0945"）に揃えてから「分」の部分（後ろ2桁）を取得
                const forCalcBufferingStartTime_getMin = memoStartTime.toString().padStart(4, '0').slice(2, 4);

                // 既存予約の開始時刻の分の一桁目
                const forCalcBufferingStartTime_getMin_1st: number = parseInt(forCalcBufferingStartTime_getMin.at(-1) ?? '0');

                const calcBufferingStartTime = parseInt(forCalcBufferingStartTime_getMin) < 15 ?
                    // 既存予約の開始時刻の分が15分以下の場合は基準値に当該分数を加算して調整（例：13:12 の場合 -> 1312-(54+12) = 12:46）
                    54 + forCalcBufferingStartTime_getMin_1st :
                    // hh:00 -> -hh:46, hh:45 -> hh:31
                    forCalcBufferingStartTime_getMin === '00' ? 54 :
                        forCalcBufferingStartTime_getMin_1st % 5 === 0 ? 14 : 15;

                // console.log("既存予約:", memoStartTime, memoFinishTime);
                // console.log("チェック対象:", theStartTime, theFinishTime);

                // 時間の重複チェックロジック
                const isOverlap: boolean =
                    // 新しい予約の開始時間が既存の予約時間内にある
                    (theStartTime >= memoStartTime && theStartTime <= memoFinishTime) ||
                    // 新しい予約の終了時間が既存の（15分余剰を含んだ）予約時間内にある
                    (theFinishTime >= memoStartTime - calcBufferingStartTime && theFinishTime <= memoFinishTime) ||
                    // 新しい予約が既存の予約を完全に包含している
                    (theStartTime <= memoStartTime && theFinishTime >= memoFinishTime);

                // 当日限定かつ 予約室が合致かつ 時間が被っている場合
                return isMatchDay && isMatchRoom && isOverlap;
            }

            return false;
        });

        return isCheckTimeSchedule;
    }

    return { checkTimeBlockEntryForm, checkTimeSchedule }
}