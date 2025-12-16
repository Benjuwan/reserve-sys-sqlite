"use client"

import { memo, useEffect, useState } from "react";
import calendarStyle from "./styles/calendarStyle.module.css";
import { calendarItemType } from "./ts/calendarItemType";
import { useAtom } from "jotai";
import { fetchTodoMemoAtom, isDesktopViewAtom } from "@/types/calendar-atom";
import PrevNextMonthBtns from "./components/PrevNextMonthBtns";
import DaydateList from "./components/DaydateList";
import DaysList from "./components/DaysList";
import { useGetMonthDays } from "./hooks/useGetMonthDays";
import { useRemovePastSchedule } from "./hooks/useRemovePastSchedule";

function Calendar() {
    const [, setDesktopView] = useAtom(isDesktopViewAtom);
    const [fetchTodoMemo] = useAtom(fetchTodoMemoAtom);

    const currYear = new Date().getFullYear();
    const currMonth = new Date().getMonth() + 1;
    const [ctrlYear, setCtrlYear] = useState<number>(currYear);
    const [ctrlMonth, setCtrlMonth] = useState<number>(currMonth);
    const [days, setDays] = useState<calendarItemType[]>([]);

    const { getMonthDays } = useGetMonthDays();
    const { removePastSchedule } = useRemovePastSchedule();

    const jumpThisMonth: () => void = () => {
        const thisYear: number = new Date().getFullYear();
        const thisMonth: number = new Date().getMonth() + 1;
        setCtrlYear(thisYear);
        setCtrlMonth(thisMonth);
        getMonthDays(thisYear, thisMonth, setDays);
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        removePastSchedule(fetchTodoMemo);

        if (window.matchMedia("(min-width: 1025px)").matches) {
            setDesktopView(true);
        }

        //「初回マウントだけ実行したい」ため以下を記述
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getMonthDays(ctrlYear, ctrlMonth, setDays);
    }, [getMonthDays, ctrlYear, ctrlMonth]);

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
                <DaysList days={days} />
            </ul>
        </section>
    );
}

export default memo(Calendar);