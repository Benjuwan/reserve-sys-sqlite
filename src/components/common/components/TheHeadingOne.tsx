"use client"

import { usePathname } from "next/navigation";
import { memo, useEffect, useState } from "react";

function TheHeadingOne() {
    const pathName: string = usePathname();

    /* React のハイドレーションエラー(418) https://react.dev/errors/418?args[] 対策 */
    const [theToday, setToday] = useState<string>('');
    useEffect(() => {
        const today: string = new Date().toLocaleDateString();
        setToday(today);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <h1>Reservation Rooms</h1>
            {pathName.length === 1 &&
                <p>- {theToday}の予約内容</p>
            }
        </>
    );
}

export default memo(TheHeadingOne);