"use client"

import { memo, useEffect, useMemo, useState } from "react";
import calendarStyle from "./styles/calendarStyle.module.css";
import { calendarItemType } from "./ts/calendarItemType";
import { todoItemType } from "../todoItems/ts/todoItemType";
import { useAtom } from "jotai";
import { fetchTodoMemoAtom, isDesktopViewAtom, todoMemoAtom } from "@/app/types/calendar-atom";
import PrevNextMonthBtns from "./components/PrevNextMonthBtns";
import { useGetMonthDays } from "./hooks/useGetMonthDays";
import { useDeleteTodoItem } from "../todoItems/hooks/useDeleteTodoItem";
import DaydateList from "./components/DaydateList";
import DaysList from "./components/DaysList";

function Calendar() {
    const [, setDesktopView] = useAtom(isDesktopViewAtom);
    const [fetchTodoMemo] = useAtom(fetchTodoMemoAtom);
    const [, setTodoMemo] = useAtom(todoMemoAtom);

    const { getMonthDays } = useGetMonthDays();
    const { deleteReservation } = useDeleteTodoItem();

    const currYear = new Date().getFullYear();
    const currMonth = new Date().getMonth() + 1;
    const [ctrlYear, setCtrlYear] = useState<number>(currYear);
    const [ctrlMonth, setCtrlMonth] = useState<number>(currMonth);
    const [days, setDays] = useState<calendarItemType[]>([]);

    const date: Date = new Date();
    const present: number = useMemo(() => {
        return parseInt(`${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (window.matchMedia("(min-width: 1025px)").matches) {
            setDesktopView(true);
        }

        if (fetchTodoMemo.length > 0) {
            const exceptPastTodoMemos: todoItemType[] = [...fetchTodoMemo].filter(memo => {
                const memoDate: number = parseInt(memo.todoID.replaceAll('/', ''));
                if (memoDate >= present) {
                    return memo;
                } else {
                    /* 過去分はDBから削除 */
                    deleteReservation(memo.id);
                }
            });

            /* 当日以降の予定のみスケジュールとして管理・把握 */
            setTodoMemo(exceptPastTodoMemos);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const jumpThisMonth: () => void = () => {
        const thisYear: number = new Date().getFullYear();
        const thisMonth: number = new Date().getMonth() + 1;
        setCtrlYear(thisYear);
        setCtrlMonth(thisMonth);
        getMonthDays(thisYear, thisMonth, setDays);
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        getMonthDays(ctrlYear, ctrlMonth, setDays);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctrlMonth]);

    return (
        <section className={calendarStyle.wrapper}>
            <h2>{ctrlYear}年{ctrlMonth}月</h2>
            <PrevNextMonthBtns props={{
                className: calendarStyle.btns,
                ctrlYear: ctrlYear,
                setCtrlYear: setCtrlYear,
                ctrlMonth: ctrlMonth,
                setCtrlMonth: setCtrlMonth
            }} />
            <button id={calendarStyle["jumpThisMonth"]} type="button" onClick={jumpThisMonth}>今月に移動</button>
            <ul className={calendarStyle.calendar}>
                <DaydateList days={days} />
                <DaysList props={{
                    days: days,
                    present: present
                }} />
            </ul>
        </section>
    );
}

export default memo(Calendar);