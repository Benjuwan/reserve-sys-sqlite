import Image from "next/image";
import { SyntheticEvent, memo } from "react";
import todoStyle from "./styles/todoStyle.module.css";
import { calendarItemType } from "../calendar/ts/calendarItemType";
import { useScrollTop } from "@/app/hooks/useScrollTop";
import { useViewTodoCtrl } from "./hooks/useViewTodoCtrl";

import add_circle from "../../../../../public/icons/add_circle.svg";

function TodoCtrlOpenBtn({ day }: { day: calendarItemType }) {
    const checkFutureMonthes: () => boolean = () => {
        const date: Date = new Date();
        const present: number = parseInt(`${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`);
        const dayDate: number = parseInt(`${day.year}${day.month.toString().padStart(2, '0')}`);

        return present < dayDate;
    }

    const { scrollTop } = useScrollTop();
    const { viewTodoCtrl } = useViewTodoCtrl();

    const handleOpenClosedBtnClicked: (btnEl: HTMLButtonElement) => void = (btnEl: HTMLButtonElement) => {
        const isCheckFutureMonthes: boolean = checkFutureMonthes();
        if (isCheckFutureMonthes) {
            const thisYear: number = new Date().getFullYear();
            const thisMonth: number = new Date().getMonth() + 1;
            alert(`今月（${thisYear}/${thisMonth}）しか予約できません`);
            return;
        }

        viewTodoCtrl(btnEl);
        scrollTop();
    }

    return (
        <button className={`${todoStyle.openBtn} todoCtrlOpen`}
            onClick={(btnEl: SyntheticEvent<HTMLButtonElement>) => handleOpenClosedBtnClicked(btnEl.currentTarget)}>
            <span>
                <Image src={add_circle} alt="登録フォーム表示ボタン" />
            </span>
        </button>
    );
}

export default memo(TodoCtrlOpenBtn);