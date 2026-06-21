import { Box } from "@chakra-ui/react";
import { memo, useEffect, useRef, useState, type FC } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { useParams } from "react-router-dom";
import { PdfHighlighter, type PdfHighlighterHandle } from "./PdfHighlighter";
import {
    PdfHighlightsOverlay,
    type AreaHighlight,
    type NormRect,
} from "./PdfHighlightsOverlay";

type NewAreaHighlight = {
    page: number;
    rect: NormRect;
};

// PDF.js WorkerをCDNから読み込む
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const DisplayExamPdf: FC = memo(() => {
    const [numPages, setNumPages] = useState(0);
    const { year, season, section } = useParams();
    const url =
        year && season && section
            ? `${window.location.origin}/storage/pdf/${year}/${year}_${season}_${section}.pdf`
            : null;

    const [highlights, setHighlights] = useState<AreaHighlight[]>([]);

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

    if (!url) {
        return null;
    }

    return (
        <PdfHighlighter ref={elementRef} onAddHighlight={onAddHighlight}>
            {(ghost) => (
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<Box p={4}>PDFを読み込んでいます...</Box>}
                    error={<Box>PDFを読み込めませんでした。</Box>}
                >
                    {width > 0 &&
                        Array.from({ length: numPages }, (_, index) => (
                            <Box key={`page_${index + 1}`} position="relative">
                                <Page
                                    pageNumber={index + 1}
                                    width={width}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
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
