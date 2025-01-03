import { memo, useMemo } from "react";
import calendarStyle from "../styles/calendarStyle.module.css";
import todoStyle from "../../todoItems/styles/todoStyle.module.css";
import { calendarItemType } from "../ts/calendarItemType";
import TodoCtrlClosedBtn from "../../todoItems/TodoCtrlClosedBtn";
import TodoCtrlOpenBtn from "../../todoItems/TodoCtrlOpenBtn";
import TodoForm from "../../todoItems/TodoForm";
import TodoList from "../../todoItems/TodoList";

type DaysListType = {
    days: calendarItemType[];
    present: number;
}

type todaySignal = {
    thisYear: number;
    thisMonth: number;
    today: number;
}

function DaysList({ props }: { props: DaysListType }) {
    const { days, present } = props;

    const isNotPastDays: (day: calendarItemType) => boolean = (day: calendarItemType) => {
        const dayDate: number = parseInt(`${day.year}${day.month}${day.day}`);
        return dayDate >= present;
    }

    const today: todaySignal = useMemo(() => {
        return {
            thisYear: new Date().getFullYear(),
            thisMonth: new Date().getMonth() + 1,
            today: new Date().getDate()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {days.map(day => (
                // カスタムデータ属性の指定は low-case でないと React から怒られる
                <li key={`${day.year}/${day.month}/${day.day}`} data-daydate={day.dayDateNum} className={
                    (
                        today.thisYear === day.year &&
                        today.thisMonth === day.month &&
                        today.today === day.day
                    ) ?
                        `${calendarStyle.todaySignal} ${calendarStyle.calendarLists}` :
                        `${calendarStyle.calendarLists}`
                }>
                    <p>
                        {day.signalPrevNextMonth && <span>{day.month}/</span>}{day.day}
                    </p>
                    {day.signalPrevNextMonth ? null :
                        <>
                            {isNotPastDays(day) &&
                                <div className={`${todoStyle.todoView}`}>
                                    <TodoCtrlOpenBtn day={day} />
                                    <div className={`${todoStyle.todoCtrlElm}`}>
                                        <TodoCtrlClosedBtn />
                                        <p className={todoStyle.today}>{day.month}/{day.day}（{day.dayDate}）</p>
                                        <TodoForm props={{
                                            todoId: `${day.year}/${day.month}/${day.day}`
                                        }} />
                                    </div>
                                    <TodoList todoID={`${day.year}/${day.month}/${day.day}`} />
                                </div>
                            }
                        </>
                    }
                </li>
            ))}
        </>
    );
}

export default memo(DaysList);