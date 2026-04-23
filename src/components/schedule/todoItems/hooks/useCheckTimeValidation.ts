import { Dispatch, SetStateAction } from "react";
import { todoItemType } from "../ts/todoItemType";
import { timeBlockBegin, timeBlockEnd } from "@/types/rooms-atom";
import { useCheckTimeBlockEntryForm } from "./useCheckTimeBlockEntryForm";

export const useCheckTimeValidation = () => {
    const { checkTimeBlockEntryForm, checkTimeSchedule } = useCheckTimeBlockEntryForm();

    const checkTimeValidation: (todoItems: todoItemType, setValidationTxt: Dispatch<SetStateAction<string>>, validationTxt?: string) => void = (
        todoItems: todoItemType,
        setValidationTxt: Dispatch<SetStateAction<string>>,
        validationTxt?: string
    ) => {
        let nextValidationTxt = '';

        if (typeof todoItems.startTime !== 'undefined' && typeof todoItems.finishTime !== 'undefined') {
            const isCheckTimeSchedule_start: boolean = checkTimeSchedule(todoItems.startTime, todoItems);
            const isCheckTimeSchedule_finish: boolean = checkTimeSchedule(todoItems.finishTime, todoItems);
            if (isCheckTimeSchedule_start || isCheckTimeSchedule_finish) {
                nextValidationTxt = '他の方が既に予約済みです';
            }

            const isCheckTimeBlockEntryForm_start: boolean = checkTimeBlockEntryForm(todoItems.startTime);
            const isCheckTimeBlockEntryForm_finish: boolean = checkTimeBlockEntryForm(todoItems.finishTime);
            if (isCheckTimeBlockEntryForm_start || isCheckTimeBlockEntryForm_finish) {
                nextValidationTxt = `「${timeBlockBegin}時〜${timeBlockEnd}時」の時間帯で指定してください`;
            }
        }

        if (validationTxt !== nextValidationTxt) {
            setValidationTxt(nextValidationTxt);
        }
    }

    return { checkTimeValidation }
}