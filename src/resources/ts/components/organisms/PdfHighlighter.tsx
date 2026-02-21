import { Box, type BoxProps } from "@chakra-ui/react";
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

type NormRect = {
    x: number;
    y: number;
    w: number;
    h: number;
};

export type PdfHighlighterHandle = {
    getRootElement: () => HTMLDivElement | null;
};

// PDF上で選択したエリア情報を取得するラッパー
export const PdfHighlighter = forwardRef<
    PdfHighlighterHandle,
    {
        children: (
            ghost: { page: number; rect: NormRect } | null,
        ) => React.ReactNode;
        onAddHighlight: (h: { page: number; rect: NormRect }) => void;
    }
>(({ children, onAddHighlight }, ref) => {
    const rootRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
        getRootElement: () => rootRef.current,
    }));

    const dragRef = useRef<{
        page: number;
        startX: number;
        startY: number;
        dragging: boolean;
    } | null>(null);

    const [ghost, setGhost] = useState<{ page: number; rect: NormRect } | null>(
        null,
    );

    const findPageElement = (target: EventTarget | null) => {
        const element = target instanceof Element ? target : null;
        return element?.closest?.("[data-page-number]") as HTMLElement | null;
    };

    const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.button !== 0) return;

        const pageEl = findPageElement(e.target);
        if (!pageEl) return;

        const page = Number(pageEl.dataset.pageNumber);
        const r = pageEl.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;

        dragRef.current = { page, startX: x, startY: y, dragging: true };

        setGhost({
            page,
            rect: { x: x / r.width, y: y / r.height, w: 0, h: 0 },
        });
    };

    const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
        const st = dragRef.current;
        if (!st?.dragging) return;

        const pageEl =
            findPageElement(e.target) ??
            rootRef.current?.querySelector(`[data-page-number="${st.page}"]`);
        if (!pageEl) return;

        const r = pageEl.getBoundingClientRect();
        const x = Math.max(0, Math.min(r.width, e.clientX - r.left));
        const y = Math.max(0, Math.min(r.height, e.clientY - r.top));

        const left = Math.min(st.startX, x);
        const top = Math.min(st.startY, y);
        const right = Math.max(st.startX, x);
        const bottom = Math.max(st.startY, y);

        setGhost({
            page: st.page,
            rect: {
                x: left / r.width,
                y: top / r.height,
                w: (right - left) / r.width,
                h: (bottom - top) / r.height,
            },
        });
    };

    const finish = () => {
        const st = dragRef.current;
        if (!st?.dragging) return;

        dragRef.current = null;

        const g = ghost;
        setGhost(null);

        if (!g) return;

        // あまりに小さい選択は無視
        if (g.rect.w < 0.01 || g.rect.h < 0.01) {
            return;
        }

        onAddHighlight({ page: g.page as number, rect: g.rect });
    };

    const onMouseUp: React.MouseEventHandler<HTMLDivElement> = (e) => finish();
    const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = (e) =>
        finish();

    return (
        <Box
            ref={rootRef}
            position="relative"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            {children(ghost)}
        </Box>
    );
});
