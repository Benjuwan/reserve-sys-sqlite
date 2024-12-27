import todoStyle from "../styles/todoStyle.module.css";
import { ChangeEvent, Dispatch, memo, SetStateAction } from "react";
import { timeBlockBegin, timeBlockEnd } from "@/app/types/rooms-atom";
import { todoItemType } from "../ts/todoItemType";
import { useHandleFormEntries } from "@/app/hooks/useHandleFormEntries";
import { useCheckTimeBlockEntryForm } from "@/app/components/schedule/todoItems/hooks/useCheckTimeBlockEntryForm";

function TodoFormItemTimeSchedule({ todoItems, setTodoItems }: {
    todoItems: todoItemType,
    setTodoItems: Dispatch<SetStateAction<todoItemType>>
}) {
    const { handleFormEntries } = useHandleFormEntries();
    const { checkTimeBlockEntryForm, checkTimeSchedule } = useCheckTimeBlockEntryForm();

    const handleTimeSchedule: (e: ChangeEvent<HTMLInputElement>) => void = (e: ChangeEvent<HTMLInputElement>) => {
        const isCheckTimeBlockEntryForm: boolean = checkTimeBlockEntryForm(e);
        if (isCheckTimeBlockEntryForm) {
            alert(`「${timeBlockBegin}時〜${timeBlockEnd}時」の時間帯で指定してください`);
            return;
        }

        const isCheckTimeSchedule: boolean = checkTimeSchedule(e, todoItems);
        if (isCheckTimeSchedule) {
            alert('他の方が既に予約済みです | TFI-TimeSchedule');
            return;
        }

        handleFormEntries<todoItemType>(e, todoItems, setTodoItems);
    }

    return (
        <div className={todoStyle.timeSchedule}>
            <label className={todoStyle.timeLabel}><span>開始時刻</span><input id="startTime" type="time" value={todoItems.startTime} onChange={(e: ChangeEvent<HTMLInputElement>) => { handleTimeSchedule(e) }} /></label>
            <label className={todoStyle.timeLabel}><span>終了時刻</span><input id="finishTime" type="time" value={todoItems.finishTime} onChange={(e: ChangeEvent<HTMLInputElement>) => { handleTimeSchedule(e) }} /></label>
        </div>
    )
}

export default memo(TodoFormItemTimeSchedule);