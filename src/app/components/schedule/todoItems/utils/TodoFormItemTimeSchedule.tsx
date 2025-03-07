import todoStyle from "../styles/todoStyle.module.css";
import { ChangeEvent, Dispatch, memo, RefObject, SetStateAction } from "react";
import { todoItemType } from "../ts/todoItemType";
import { useCheckTimeValidation } from "../hooks/useCheckTimeValidation";
import { useHandleFormEntries } from "@/app/hooks/useHandleFormEntries";

function TodoFormItemTimeSchedule({ todoItems, setTodoItems, validationTxtRef }: {
    todoItems: todoItemType,
    setTodoItems: Dispatch<SetStateAction<todoItemType>>,
    validationTxtRef?: RefObject<string>
}) {
    const { checkTimeValidation } = useCheckTimeValidation();
    const { handleFormEntries } = useHandleFormEntries();

    const handleTimeSchedule: (e: ChangeEvent<HTMLInputElement>) => void = (e: ChangeEvent<HTMLInputElement>) => {
        checkTimeValidation(todoItems, validationTxtRef);
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