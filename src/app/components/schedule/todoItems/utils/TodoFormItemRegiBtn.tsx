import todoStyle from "../styles/todoStyle.module.css";
import { memo, SyntheticEvent, useMemo } from "react";
import { todoItemType } from "../ts/todoItemType";
import { useCloseModalWindow } from "../hooks/useCloseModalWindow";
import { useRegiTodoItem } from "../hooks/useRegiTodoItem";
import { useUpdateTodoItem } from "../hooks/useUpdateTodoItem";
import { useHandleFormItems } from "../hooks/useHandleFormItems";
import { useCheckTimeBlockEntryForm } from "@/app/components/schedule/todoItems/hooks/useCheckTimeBlockEntryForm";

function TodoFormItemRegiBtn({ todoItems, resetStates }: {
    todoItems: todoItemType,
    resetStates: () => void
}) {
    const { closeModalWindow } = useCloseModalWindow();
    const { regiTodoItem } = useRegiTodoItem();
    const { updateTodoItem } = useUpdateTodoItem();
    const { handleOpenClosedBtnClicked } = useHandleFormItems();
    const { checkTimeSchedule, checkDuplicateTimeSchedule } = useCheckTimeBlockEntryForm();

    const isBtnDisabled: boolean = useMemo(() => {
        const isCheckPw: boolean = todoItems.pw.length === 0;
        const isCheckContent: boolean = todoItems.todoContent.length === 0;

        const inCorrectTimeSchedule: boolean = (typeof todoItems.startTime !== 'undefined' && typeof todoItems.finishTime !== 'undefined') ?
            parseInt(todoItems.startTime.replace(':', '')) > parseInt(todoItems.finishTime.replace(':', ''))
            : false;

        if (
            (typeof todoItems.startTime !== 'undefined' &&
                checkTimeSchedule(todoItems.startTime, todoItems)) ||
            (typeof todoItems.finishTime !== 'undefined' &&
                checkTimeSchedule(todoItems.finishTime, todoItems))
        ) {
            alert('他の方が既に予約済みです | TFI-RegiBtn');
            return true;
        }

        return isCheckPw || isCheckContent || inCorrectTimeSchedule;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todoItems]);

    // 編集後に edit:true のままだと誰でも編集できてしまうので false に上書き（＝再編集を行うには再度パスワード入力が必要となる）
    const adjustEditState_updateTodoItem: (todoItems: todoItemType) => void = (todoItems: todoItemType) => {
        const adjustEditStateTodoItems: todoItemType = {
            ...todoItems,
            edit: false
        }
        updateTodoItem(adjustEditStateTodoItems);
    }

    return (
        <button className={todoStyle.formBtns} id={todoStyle.regiUpdateBtn}
            type="button"
            disabled={isBtnDisabled}
            onClick={(btnEl: SyntheticEvent<HTMLButtonElement>) => {
                const isCheckDuplicateTime: boolean = checkDuplicateTimeSchedule(todoItems);
                if (isCheckDuplicateTime) {
                    alert('希望予約時間が他の予定と重複しています');
                    return;
                }

                if (!todoItems.edit) {
                    regiTodoItem(todoItems);
                    handleOpenClosedBtnClicked(btnEl.currentTarget);
                } else {
                    btnEl.stopPropagation(); // 親要素のクリックイベント（OnViewModalWindow）発生を防止
                    adjustEditState_updateTodoItem(todoItems);
                    closeModalWindow();
                }
                resetStates();
            }}>{!todoItems.edit ? '登録' : '再登録'}
        </button>
    )
}

export default memo(TodoFormItemRegiBtn);