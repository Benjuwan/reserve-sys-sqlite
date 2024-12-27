import { memo, SyntheticEvent } from "react";
import todoStyle from "./styles/todoStyle.module.css";
import { todoItemType } from "./ts/todoItemType";
import { useAtom } from "jotai";
import { todoMemoAtom } from "@/app/types/calendar-atom";
import TodoItemsEditable from "./utils/TodoItemsEditable";
import TodoItemsDisEditable from "./utils/TodoItemsDisEditable";
import { useCloseModalWindow } from "./hooks/useCloseModalWindow";
import { useScrollTop } from "@/app/hooks/useScrollTop";
import { useUpdateTodoItem } from "./hooks/useUpdateTodoItem";

function TodoItems({ todoItem }: { todoItem: todoItemType }) {
    const [todoMemo, setTodoMemo] = useAtom(todoMemoAtom);
    const { updateReservation } = useUpdateTodoItem();

    const updateTodoMemoEditState: (editState: boolean) => void = (editState: boolean) => {
        const updateTodoList: todoItemType = {
            ...todoItem,
            edit: editState // todoItem.edit
        }

        if (todoItem.startTime || todoItem.finishTime) {
            updateTodoList.startTime = todoItem.startTime;
            updateTodoList.finishTime = todoItem.finishTime;
        }

        const exceptUpdateTodoMemos: todoItemType[] = [...todoMemo].filter(todoMemoItem => todoMemoItem.id !== todoItem.id);

        setTodoMemo([...exceptUpdateTodoMemos, updateTodoList]);

        // 編集画面の[戻る]ボタンを押下してパスワードロックした場合は DB の todoItem.edit を更新
        if (updateTodoList.edit === false) {
            updateReservation(updateTodoList);
        }
    }

    const { closeModalWindow } = useCloseModalWindow();
    const { scrollTop } = useScrollTop();
    const handleCloseModalWindowBtnClicked: (btnEl: SyntheticEvent<HTMLButtonElement>) => void = (btnEl: SyntheticEvent<HTMLButtonElement>) => {
        btnEl.stopPropagation(); // 親要素のクリックイベント（OnViewModalWindow）発生を防止
        closeModalWindow();
        scrollTop();
    }

    return (
        <div className={todoStyle.modalWindow}>
            <div className={todoItem.edit ?
                `${todoStyle.modalWindowChild} ${todoStyle.modalWindowChild_editabel}` :
                `${todoStyle.modalWindowChild}`
            }>
                {todoItem.edit ?
                    <TodoItemsEditable props={{
                        todoItem: todoItem,
                        updateTodoMemoEditState: updateTodoMemoEditState,
                        handleCloseModalWindowBtnClicked: handleCloseModalWindowBtnClicked
                    }} /> :
                    <TodoItemsDisEditable props={{
                        todoItem: todoItem,
                        updateTodoMemoEditState: updateTodoMemoEditState
                    }} />
                }
            </div>
            <button id={todoStyle["closeBtn"]} type="button" className={todoStyle.formBtns} onClick={(closeBtnEl: SyntheticEvent<HTMLButtonElement>) => handleCloseModalWindowBtnClicked(closeBtnEl)}>詳細画面を閉じる</button>
        </div>
    );
}

export default memo(TodoItems);