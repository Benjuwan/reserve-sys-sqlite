"use client"

import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";

function TheHeadingOne() {
    const pathName: string = usePathname();
    const today: string = useMemo(() => new Date().toLocaleDateString(), []);

    return (
        <>
            <h1>Reservation Rooms</h1>
            {pathName.length === 1 &&
                <p>- {today}の予約内容</p>
            }
        </>
    );
}

export default memo(TheHeadingOne);