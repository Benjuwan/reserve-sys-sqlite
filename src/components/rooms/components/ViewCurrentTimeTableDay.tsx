import { memo, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type timeTableDayProps = {
    ctrlMultiTimeTable: number;
    isLastWeek: boolean;
};

function ViewCurrentTimeTableDay({ props }: { props: timeTableDayProps }) {
    const { ctrlMultiTimeTable, isLastWeek } = props;

    const pathName: string = usePathname();

    const [theThisMonth, setThisMonth] = useState<number | undefined>(undefined);

    const isNextMonth: boolean = useMemo(() => isLastWeek && ctrlMultiTimeTable - 7 <= 0, [isLastWeek, ctrlMultiTimeTable]);

    const isDec: boolean = useMemo(() => theThisMonth === 12, [theThisMonth]);

    // ハイドレーションエラーおよびLintエラー対策のための処理
    useEffect(() => {
        const timeId = setTimeout(() => {
            const thisMonth: number = new Date().getMonth() + 1;
            setThisMonth(thisMonth);
        }, 1);

        // シンプルな effect 処理だとLintエラーが表示されてしまうので
        // 遅延実行およびそのクリーンアップ処理で対処
        return () => {
            clearTimeout(timeId);
        }
    }, [setThisMonth]);

    if (typeof theThisMonth === 'undefined') {
        return <p>- mm/d の予約内容（※7日後まで確認可能）</p>
    }

    return (
        <>
            {(pathName.length === 1 && typeof theThisMonth === 'number') &&
                <p>- <b>{
                    isNextMonth ?
                        (isDec ? 1 : theThisMonth + 1) : theThisMonth
                }/{ctrlMultiTimeTable}</b> の予約内容（※7日後まで確認可能）</p>
            }
        </>
    );
}

export default memo(ViewCurrentTimeTableDay);