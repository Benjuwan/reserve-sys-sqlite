import { ChangeEvent, Dispatch, Ref, memo, SetStateAction } from "react";
import { todoItemType } from "../ts/todoItemType";
import { roomsType } from "@/app/components/rooms/ts/roomsType";
import { useHandleFormEntries } from "@/app/hooks/useHandleFormEntries";

function TodoFormItemRoom({ rooms, todoItems, setTodoItems, roomRef }: {
    rooms: roomsType,
    todoItems: todoItemType,
    setTodoItems: Dispatch<SetStateAction<todoItemType>>,
    roomRef: Ref<HTMLSelectElement> | undefined
}) {
    const { handleFormEntries } = useHandleFormEntries();

    return (
        <>
            {rooms.length > 0 &&
                <>
                    <label><span>場所</span></label>
                    <select name="rooms" id="rooms" ref={roomRef} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFormEntries<todoItemType>(e, todoItems, setTodoItems)}>
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