import { ChangeEvent } from "react";
import { timeBlockBegin, timeBlockEnd } from "@/app/types/rooms-atom";
import { todoItemType } from "../ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom } from "@/app/types/calendar-atom";

export const useCheckTimeBlockEntryForm = () => {
    const [todoMemo] = useAtom(todoMemoAtom);

    /* `src/app/types/rooms-atom.ts`で指定した予約受付可能な時間帯かチェック */
    const checkTimeBlockEntryForm: (e: ChangeEvent<HTMLInputElement>) => boolean = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const valueStr: string = e.target.value;
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
                const isSelf_allowOverlapSchedule: boolean = (todoItems.id === memo.id) && (parseInt(memo.startTime.replace(':', '')) <= theTime && parseInt(memo.finishTime.replace(':', '')) >= theTime);
                if (isSelf_allowOverlapSchedule) {
                    return false;
                }

                const isOverlapSchedule: boolean = (parseInt(memo.startTime?.replace(':', '')) <= theTime && parseInt(memo.finishTime?.replace(':', '')) >= theTime);

                // 当日限定かつ 予約室が合致かつ 時間が被っている場合 
                return isMatchDay && isMatchRoom && isOverlapSchedule;
            }
        });

        return isCheckTimeSchedule;
    }

    /* 同部屋内・同日での予約時間の重複確認（開始〜終了「予約時間全体」を通して他と被っていないか登録時にチェック）*/
    const checkDuplicateTimeSchedule: (todoItems: todoItemType) => boolean = (
        todoItems: todoItemType
    ) => {
        let isCheckDuplicateTime: boolean = false;

        for (const memo of todoMemo) {
            const isMatchRoom: boolean = typeof todoItems.rooms !== 'undefined' ? memo.rooms === todoItems.rooms : false;
            const isMatchDay: boolean = memo.todoID === todoItems.todoID;

            if (isMatchRoom && isMatchDay) {
                if (
                    typeof todoItems.startTime !== 'undefined' &&
                    typeof todoItems.finishTime !== 'undefined' &&
                    typeof memo.startTime !== 'undefined' &&
                    typeof memo.finishTime !== 'undefined'
                ) {
                    const theStart: number = parseInt(todoItems.startTime.replace(':', ''));
                    const compareStart: number = parseInt(memo.startTime.replace(':', ''));
                    const theFinish: number = parseInt(todoItems.finishTime.replace(':', ''));
                    const compareFinish: number = parseInt(memo.finishTime.replace(':', ''));

                    // 自身が登録した予約時間は検証対象外（編集時の回避措置）
                    const isSelf_allowOverlapSchedule: boolean = (todoItems.id === memo.id);
                    if (isSelf_allowOverlapSchedule) {
                        return false;
                    }

                    isCheckDuplicateTime = theStart < compareStart && compareFinish < theFinish;
                }
            }
        }

        return isCheckDuplicateTime;
    }

    return { checkTimeBlockEntryForm, checkTimeSchedule, checkDuplicateTimeSchedule }
}