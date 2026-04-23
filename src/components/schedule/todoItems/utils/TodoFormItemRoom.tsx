import { SyntheticEvent, Dispatch, Ref, memo, SetStateAction } from "react";
import { todoItemType } from "../ts/todoItemType";
import { roomsType } from "@/components/rooms/ts/roomsType";
import { useCheckTimeValidation } from "../hooks/useCheckTimeValidation";

function TodoFormItemRoom({ rooms, todoItems, setTodoItems, roomRef, validationTxt, setValidationTxt }: {
    rooms: roomsType,
    todoItems: todoItemType,
    setTodoItems: Dispatch<SetStateAction<todoItemType>>,
    roomRef: Ref<HTMLSelectElement> | undefined,
    validationTxt: string,
    setValidationTxt: Dispatch<SetStateAction<string>>
}) {
    const { checkTimeValidation } = useCheckTimeValidation();

    const handleRoomChange = (e: SyntheticEvent<HTMLSelectElement>) => {
        const nextTodoItems: todoItemType = {
            ...todoItems,
            [e.currentTarget.id]: e.currentTarget.value
        }

        setTodoItems(nextTodoItems);
        checkTimeValidation(nextTodoItems, setValidationTxt, validationTxt);
    }

    return (
        <>
            {rooms.length > 0 &&
                <>
                    <label htmlFor="rooms"><span>場所</span></label>
                    <select name="rooms" id="rooms" ref={roomRef} onChange={handleRoomChange}>
                        {rooms.map((room, i) => (
                            <option key={i} value={room.room}>{room.room}</option>
                        ))}
                    </select>
                </>
            }
        </>
    )
}

export default memo(TodoFormItemRoom);