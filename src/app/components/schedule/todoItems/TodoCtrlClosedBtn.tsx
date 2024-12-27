import { SyntheticEvent, memo } from "react";
import todoStyle from "./styles/todoStyle.module.css";
import { useViewTodoCtrl } from "./hooks/useViewTodoCtrl";
import { useScrollTop } from "@/app/hooks/useScrollTop";

function TodoCtrlClosedBtn() {
    const { scrollTop } = useScrollTop();
    const { viewTodoCtrl } = useViewTodoCtrl();
    const handleOpenClosedBtnClicked: (btnEl: HTMLButtonElement) => void = (btnEl: HTMLButtonElement) => {
        viewTodoCtrl(btnEl);
        scrollTop();
    }

    return (
        <button className={`${todoStyle.closeBtn} todoCtrlClose`} onClick={(btnEl: SyntheticEvent<HTMLButtonElement>) => handleOpenClosedBtnClicked(btnEl.currentTarget)}>
            <span className="material-symbols-outlined">close</span>
        </button>
    );
}

export default memo(TodoCtrlClosedBtn);