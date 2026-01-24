import { Box, type BoxProps } from "@chakra-ui/react";
import React, { forwardRef } from "react";
import type { HighlightRect } from "../../hooks/usePdfHighlights";

type Props = BoxProps & {
    onAddHighlight: (
        page: number,
        rects: HighlightRect[],
        text?: string,
    ) => void;
};

export const PdfHighlighter = forwardRef<HTMLDivElement, Props>(
    ({ onAddHighlight, children, ...boxProps }, ref) => {
        const resetSelection = () => {
            window.getSelection()?.removeAllRanges();
        };

        const handleMouseUp = () => {
            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0) return;

            const range = sel.getRangeAt(0);
            const rangeRect = range.getBoundingClientRect();
            if (rangeRect.width < 2 && rangeRect.height < 2) return;

            const ancestor =
                range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
                    ? (range.commonAncestorContainer as HTMLElement)
                    : range.commonAncestorContainer.parentElement;

            const pageEl = ancestor?.closest?.(
                "[data-page-number]",
            ) as HTMLElement | null;
            if (!pageEl) return;

            const pageNum = Number(pageEl.getAttribute("data-page-number"));
            if (!Number.isFinite(pageNum)) return;

            const textLayer =
                (pageEl.querySelector(
                    ".react-pdf__Page__textContent",
                ) as HTMLElement | null) ??
                (pageEl.querySelector(".textLayer") as HTMLElement | null);
            if (!textLayer) return;

            const spans = Array.from(textLayer.querySelectorAll("span"));
            const rr = range.getBoundingClientRect();
            const yPad = Math.max(2, rr.height * 0.25);
            const xPad = 2;

            const selectedRects = spans
                .map((span) => span.getBoundingClientRect())
                .filter((r) => r.width > 0 && r.height > 0)
                .filter((r) => {
                    const cx = r.left + r.width / 2;
                    const cy = r.top + r.height / 2;
                    return (
                        cx >= rr.left - xPad &&
                        cx <= rr.right + xPad &&
                        cy >= rr.top - yPad &&
                        cy <= rr.bottom + yPad
                    );
                })
                .filter((r) => r.height <= rr.height * 1.6);

            if (selectedRects.length === 0) return;

            const pb = pageEl.getBoundingClientRect();
            const rectsRaw = selectedRects.map((r) => ({
                x: (r.left - pb.left) / pb.width,
                y: (r.top - pb.top) / pb.height,
                w: r.width / pb.width,
                h: r.height / pb.height,
            }));

            // 同一行っぽいrectを横方向にマージ（濃淡/重なりの軽減）
            const rects = rectsRaw
                .filter((r) => r.w > 0 && r.h > 0)
                .sort((a, b) => a.y - b.y || a.x - b.x)
                .reduce<HighlightRect[]>((acc, r) => {
                    const last = acc[acc.length - 1];
                    if (!last) return [r];

                    const yTol = 0.012;
                    const hTol = 0.02;
                    const gapTol = 0.03;

                    const sameLine =
                        Math.abs(last.y - r.y) < yTol &&
                        Math.abs(last.h - r.h) < hTol;
                    const gap = r.x - (last.x + last.w);

                    if (!sameLine || gap > gapTol) {
                        acc.push(r);
                        return acc;
                    }

                    const left = Math.min(last.x, r.x);
                    const right = Math.max(last.x + last.w, r.x + r.w);
                    last.x = left;
                    last.w = right - left;
                    last.y = Math.min(last.y, r.y);
                    last.h = Math.max(last.h, r.h);
                    return acc;
                }, []);

            const text = sel.toString().trim() || undefined;
            onAddHighlight(pageNum, rects, text);

            resetSelection();
        };

        return (
            <Box
                ref={ref}
                onMouseUp={handleMouseUp}
                userSelect="text"
                {...boxProps}
            >
                {children}
            </Box>
        );
    },
);
