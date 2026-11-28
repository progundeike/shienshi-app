export type MemoPosition = { x: number; y: number };

export const clampMemoPosition = (
    position: MemoPosition,
    width: number,
    height: number,
    viewportWidth: number,
    viewportHeight: number,
): MemoPosition => ({
    x: Math.max(0, Math.min(position.x, Math.max(0, viewportWidth - width))),
    y: Math.max(0, Math.min(position.y, Math.max(0, viewportHeight - height))),
});

export const readExamMemo = (key: string): { text: string; failed: boolean } => {
    try {
        return { text: sessionStorage.getItem(key) ?? "", failed: false };
    } catch {
        return { text: "", failed: true };
    }
};

export const saveExamMemo = (key: string, text: string): boolean => {
    try {
        sessionStorage.setItem(key, text);
        return true;
    } catch {
        return false;
    }
};
