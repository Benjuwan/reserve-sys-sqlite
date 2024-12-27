import { ChangeEvent, memo, useRef, useState } from "react";
import todoStyle from "./styles/todoStyle.module.css";
import { useAtom } from "jotai";
import { roomsAtom } from "@/app/types/rooms-atom";
import { todoItemType } from "./ts/todoItemType";
import TodoFormItemContent from "./utils/TodoFormItemContent";
import TodoFormItemRoom from "./utils/TodoFormItemRoom";
import TodoFormItemTimeSchedule from "./utils/TodoFormItemTimeSchedule";
import TodoFormItemPassword from "./utils/TodoFormItemPassword";
import TodoFormItemRegiBtn from "./utils/TodoFormItemRegiBtn";
import { useRegiTodoItem } from "./hooks/useRegiTodoItem";
import { useUpdateTodoItem } from "./hooks/useUpdateTodoItem";
import { useScrollTop } from "@/app/hooks/useScrollTop";
import { useHandleFormItems } from "./hooks/useHandleFormItems";
import { useCheckTimeBlockEntryForm } from "./hooks/useCheckTimeBlockEntryForm";

type TodoFormType = {
    todoItem?: todoItemType;
    todoId?: string;
}

function TodoForm({ props }: { props: TodoFormType }) {
    const { todoItem, todoId } = props;

    const [rooms] = useAtom(roomsAtom);
    const roomRef = useRef<null | HTMLSelectElement>(null);

    const initTodoItems: todoItemType = {
        id: todoItem ? todoItem.id : '001',
        todoID: todoId ? todoId : todoItem ? todoItem.todoID : '001',
        todoContent: '',
        edit: todoItem ? todoItem.edit : false,
        pw: '',
        rooms: roomRef.current !== null ? roomRef.current.value : rooms[0].room,
        startTime: '',
        finishTime: ''
    }
    const [todoItems, setTodoItems] = useState<todoItemType>(initTodoItems);

    const { regiTodoItem } = useRegiTodoItem();
    const { updateTodoItem } = useUpdateTodoItem();
    const { scrollTop } = useScrollTop();
    const { handleOpenClosedBtnClicked } = useHandleFormItems();
    const { checkDuplicateTimeSchedule } = useCheckTimeBlockEntryForm();

    const resetStates: () => void = () => {
        setTodoItems(initTodoItems);
        setTimeout(() => scrollTop()); // button のクリックイベントでスクロールトップしないので回避策として疑似的な遅延処理
    }

    return (
        <form className={todoStyle.todoForm} onSubmit={(formElm: ChangeEvent<HTMLFormElement>) => {
            formElm.preventDefault();
            const isCheckDuplicateTime: boolean = checkDuplicateTimeSchedule(todoItems);
            if (isCheckDuplicateTime) {
                alert('希望予約時間が他の予定と重複しています');
                return;
            }

            if (!todoItems.edit) {
                regiTodoItem(todoItems);
                handleOpenClosedBtnClicked(formElm);
            } else {
                updateTodoItem(todoItems);
            }
            resetStates();
        }}>
            {/* 予約内容 */}
            <TodoFormItemContent todoItems={todoItems} setTodoItems={setTodoItems} />

            {/* 予約室 */}
            <TodoFormItemRoom rooms={rooms} todoItems={todoItems} setTodoItems={setTodoItems} roomRef={roomRef} />

            {/* タイムテーブル（スケジュール）*/}
            <TodoFormItemTimeSchedule todoItems={todoItems} setTodoItems={setTodoItems} />

            {/* パスワード */}
            <TodoFormItemPassword todoItems={todoItems} setTodoItems={setTodoItems} />

            {/* 登録ボタン */}
            <TodoFormItemRegiBtn todoItems={todoItems} resetStates={resetStates} />
        </form>
    );
}

export default memo(TodoForm);