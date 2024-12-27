import { todoItemType } from "../ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom } from "@/app/types/calendar-atom";

export const useUpdateTodoItem = () => {
    const [todoMemo, setTodoMemo] = useAtom(todoMemoAtom);

    /* データベース（SQLite）の当該予約を更新 */
    const updateReservation: (data: todoItemType) => Promise<todoItemType> = async (data: todoItemType) => {
        const response = await fetch(`/api/reservations/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    };

    /* ToDo（予約）の更新 */
    const updateTodoItem: (todoItems: todoItemType) => void = (todoItems: todoItemType) => {
        const updateTodoList: todoItemType = { ...todoItems };

        const exceptRemoveTodoItems: todoItemType[] = [...todoMemo].filter(todoItem => todoItem.id !== updateTodoList.id); // 今回更新（削除）対象の todoItem 以外を返す

        if (updateTodoList.todoContent.length > 0) {
            updateReservation(updateTodoList);
            setTodoMemo([...exceptRemoveTodoItems, updateTodoList]);
        }
    }

    return { updateTodoItem, updateReservation }
}