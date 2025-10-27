import { SyntheticEvent, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { roomsInfoToolTipAtom } from "@/types/rooms-atom";

export const useCtrlToolTips = () => {
    // ツールチップ内容（予約情報）
    const [roomsInfo, setRoomsInfo] = useAtom(roomsInfoToolTipAtom);

    // `setTimeout`管理用のref（非制御要素）
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // クリーンアップ処理：コンポーネントアンマウント時にタイマーをクリア
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    // ツールチップの座標操作
    const _ctrlToolTips: (event: SyntheticEvent) => void = (event: SyntheticEvent) => {
        if (roomsInfo?.length === 0) {
            return;
        }

        // 前回のタイマーをキャンセル
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        /* レンダリング順序的にDOM要素がnullになってしまうので`setTimeout`で処理遅延を施して確実に存在を認知させる */
        timerRef.current = setTimeout(() => {
            // x座標の取得
            let xPos: number = 0;
            if (event.nativeEvent instanceof MouseEvent) {
                xPos = event.nativeEvent.clientX;
            } else if (event.nativeEvent instanceof TouchEvent) {
                xPos = event.nativeEvent.changedTouches[0].clientX;
            }

            // y座標の取得
            let yPos: number = 0;
            if (event.nativeEvent instanceof MouseEvent) {
                yPos = event.nativeEvent.clientY;
            } else if (event.nativeEvent instanceof TouchEvent) {
                yPos = event.nativeEvent.changedTouches[0].clientY;
            }

            const roomInfoToolTip: HTMLElement | null = document.querySelector('.roomInfoToolTip');

            if (roomInfoToolTip && (xPos > 0 && yPos > 0)) {
                roomInfoToolTip.style.cssText = `transform:translate(${xPos}px, ${yPos}px);`;
                roomInfoToolTip.style.setProperty('display', 'block'); // ツールチップ表示（ちらつき防止のため位置調整後に描画する）
            }

            timerRef.current = null; // タイマーをクリア
        });
    }

    // ツールチップの実行イベントリスナー（表示）
    const hoverEventListener: (e: SyntheticEvent) => void = (e: SyntheticEvent) => {
        const targetDataInfo: string | null = e.currentTarget.getAttribute('data-info');
        if (targetDataInfo) {
            _ctrlToolTips(e);
            setRoomsInfo(targetDataInfo);
        }
    }

    // ツールチップの実行イベントリスナー（非表示）
    const leaveEventListener: () => void = () => {
        // マウスが離れた時は保留中のタイマーもキャンセル
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        setRoomsInfo(undefined);
    }

    return { hoverEventListener, leaveEventListener }
}