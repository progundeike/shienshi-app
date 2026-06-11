import { Box } from "@chakra-ui/react";
import { FC, memo, useEffect, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { useParams } from "react-router-dom";

import { PdfHighlighter, PdfHighlighterHandle } from "./PdfHighlighter";
import {
    AreaHighlight,
    NormRect,
    PdfHighlightsOverlay,
} from "./PdfHighlightsOverlay";

type NewAreaHighlight = {
    page: number;
    rect: NormRect;
};

export const DisplayExamPdf: FC = memo(() => {
    const [numPages, setNumPages] = useState(1);
    const { year, season, section } = useParams();
    const url = `${window.location.origin}/storage/pdf/${year}/${year}_${season}_${section}.pdf`;
    const [highlights, setHighlights] = useState<AreaHighlight[]>([]);

    // Workerのパスを設定　現在はCDNを使用
    pdfjs.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs";

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    // Documentに渡すwidthを設定するためのstate
    const [width, setWidth] = useState(0);
    const elementRef = useRef<PdfHighlighterHandle | null>(null);

    const onAddHighlight = (h: NewAreaHighlight) => {
        setHighlights((prev) => [...prev, { ...h, id: crypto.randomUUID() }]);
    };

    const onDeleteHighlight = (id: string) => {
        setHighlights((prev) => prev.filter((h) => h.id !== id));
    };

    useEffect(() => {
        const root = elementRef.current?.getRootElement();
        if (!root) return;

        const handleResize = () => {
            setWidth(root.clientWidth);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(root);

        // 初期値を設定
        handleResize();

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <PdfHighlighter ref={elementRef} onAddHighlight={onAddHighlight}>
            {(ghost) => (
                <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from(new Array(numPages), (el, index) => (
                        <Box key={`page_${index + 1}`} position="relative">
                            <Page
                                pageNumber={index + 1}
                                width={width}
                                renderTextLayer={false}
                            />
                            <PdfHighlightsOverlay
                                highlights={highlights}
                                page={index + 1}
                                ghost={ghost}
                                onDelete={onDeleteHighlight}
                            />
                        </Box>
                    ))}
                </Document>
            )}
        </PdfHighlighter>
    );
});
