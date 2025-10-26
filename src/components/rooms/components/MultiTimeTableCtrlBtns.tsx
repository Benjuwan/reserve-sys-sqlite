import { memo } from "react";
import roomStyle from "../styles/roomstyle.module.css";
import ViewCurrentTimeTableDay from "./ViewCurrentTimeTableDay";

type ctrlBtnsProps = {
    ctrlMultiTimeTable: number;
    setCtrlMultiTimeTable: React.Dispatch<React.SetStateAction<number>>;
    theToday: number;
    theThisLastDay: number;
};

function MultiTimeTableCtrlBtns({ props }: { props: ctrlBtnsProps }) {
    const { ctrlMultiTimeTable, setCtrlMultiTimeTable, theToday, theThisLastDay } = props;

    // 各種条件判定に利用するための「今日・本日」の固定値
    const solidValue_theToday: number = theToday;

    // タイムテーブルの表示制御に利用するための「今日・本日」の可変値
    const liquidValue_theToday: number = ctrlMultiTimeTable;

    // 最終週かどうか判定
    const isLastWeek: boolean = solidValue_theToday > (theThisLastDay - 7);

    // 翌日のタイムテーブルを制御する関数
    const ctrlNextTimeTable: (day: number) => void = (day: number) => {
        const oneWeekLater: number = solidValue_theToday + 7;
        const isPassedThisMonth: boolean = day <= 7 && day >= oneWeekLater - theThisLastDay;

        // 当日より起算して7日を超える場合は何もしない（タイムテーブルの表示は7日後までに制限）
        if (day >= oneWeekLater || (isLastWeek && isPassedThisMonth)) {
            return;
        }

        //（7日後がちょうど当月の最終日かつ）最終日を超過した場合は来月初日をセットする
        if (
            (oneWeekLater - theThisLastDay === 0 && day > theThisLastDay) ||
            day >= theThisLastDay
        ) {
            setCtrlMultiTimeTable(1);
            return;
        }

        setCtrlMultiTimeTable(prev => prev + 1);
    }

    // 前日のタイムテーブルを制御する関数
    const ctrlPrevTimeTable: (day: number) => void = (day: number) => {
        if (day === solidValue_theToday) {
            return;
        }

        if (day === 1) {
            setCtrlMultiTimeTable(theThisLastDay);
            return;
        }

        setCtrlMultiTimeTable(prev => prev - 1);
    }

    // ボタンのクリックイベントハンドラ（タイムテーブルの制御を担う）
    const handleCtrlMultiTimeTable: (e: React.MouseEvent<HTMLButtonElement>) => void = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btnDataAttr: string = e.currentTarget.getAttribute('data-btn') ?? '';

        if (btnDataAttr === 'prev') {
            ctrlPrevTimeTable(liquidValue_theToday);
        } else if (btnDataAttr === 'next') {
            ctrlNextTimeTable(liquidValue_theToday);
        }
    }

    return (
        <>
            <div className={roomStyle.multiTimeTableCtrlBtns}>
                <button onClick={handleCtrlMultiTimeTable} data-btn="prev">&lt; 前日</button>
                <button onClick={handleCtrlMultiTimeTable} data-btn="next">翌日 &gt;</button>
            </div>
            <ViewCurrentTimeTableDay ctrlMultiTimeTable={liquidValue_theToday} isLastWeek={isLastWeek} />
        </>
    );
}

export default memo(MultiTimeTableCtrlBtns);