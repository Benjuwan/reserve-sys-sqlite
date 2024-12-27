import Link from "next/link";
import { memo, useMemo } from "react";
import baseStyle from "../../styles/page.module.css";

function Footer() {
    const thisYear: number = useMemo(() => {
        const data: Date = new Date();
        return data.getFullYear();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <footer className={baseStyle.theFooter}>
            <p><small>&copy; {thisYear} <Link href={'https://github.com/benjuwan'} target="_blank">benjuwan</Link></small></p>
        </footer>
    );
}

export default memo(Footer);