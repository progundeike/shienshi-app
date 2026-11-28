// 同一オリジンの問題専用ページだけを開く。参照を保持し、再クリックで
// 再読み込みしないことで別画面のマーカー・スクロール位置を維持する。
export const createExamPdfWindowOpener = () => {
    let openedWindow: Window | null = null;
    let previousUrl = "";

    return (url: string): boolean => {
        const target = new URL(url, window.location.origin);
        if (target.origin !== window.location.origin) return false;

        try {
            if (
                openedWindow && !openedWindow.closed && previousUrl === target.href &&
                openedWindow.location.href === target.href
            ) {
                openedWindow.focus();
                return true;
            }

            // noopener は成功時も null を返すため、ここでは指定しない。
            // 外部URLは上で拒否し、ボタンのクリックから直接呼び出す。
            openedWindow = window.open(
                target.href,
                "shienshi-exam-pdf-window",
                "popup,width=1000,height=800,resizable=yes,scrollbars=yes",
            );
            if (!openedWindow) return false;
            previousUrl = target.href;
            openedWindow.focus();
            return true;
        } catch {
            // 利用者が別画面を他サイトへ移動した場合などは再試行できるようにする。
            openedWindow = null;
            return false;
        }
    };
};
