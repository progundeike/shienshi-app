import { useEffect, useMemo, useState } from "react";

export type HighlightRect = { x: number; y: number; w: number; h: number };

export type Highlight = {
    id: string;
    page: number;
    rects: HighlightRect[];
    text?: string;
    createdAt: number;
};

export const usePdfHighlights = (storageKey: string) => {
    const [highlights, setHighlights] = useState<Highlight[]>(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? (JSON.parse(raw) as Highlight[]) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(highlights));
        } catch {
            // ignore (quota / privacy mode)
        }
    }, [storageKey, highlights]);

    const addHighlight = (page: number, rects: HighlightRect[], text?: string) => {
        const id = crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`;
        const now = Date.now();
        setHighlights((prev) => [...prev, { id, page, rects, text, createdAt: now }]);
    };

    const resetHighlights = () => {
        setHighlights([]);
        try {
            localStorage.removeItem(storageKey);
        } catch {
            // ignore
        }
        window.getSelection()?.removeAllRanges();
    };

    return { highlights, addHighlight, resetHighlights };
};