import { Box } from "@chakra-ui/react";
import { FC, memo, useEffect, useMemo, useRef, useState } from "react";
import {
    FaHouseFloodWaterCircleArrowRight,
    FaPersonWalkingDashedLineArrowRight,
} from "react-icons/fa6";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { json, useParams } from "react-router-dom";
import { usePdfHighlights } from "../../hooks/usePdfHighlights";
import { PdfHighlighter } from "./PdfHighLighter";
import { PdfHighlightsOverlay } from "./PdfHighlightsOverlay";

export const DisplayExamPdf: FC = memo(() => {
    const [numPages, setNumPages] = useState(1);
    const { year, season, section } = useParams();

    const [hasTextLayer, setHasTextLayer] = useState<boolean | null>(null);

    // Workerのパスを設定　現在はCDNを使用
    pdfjs.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs";

    const examCode = useMemo(
        () => `${year}_${season}_${section}`,
        [year, season, section],
    );
    const url = useMemo(
        () =>
            `http://${window.location.host}/storage/pdf/${year}/${examCode}.pdf`,
        [year, examCode],
    );

    const storageKey = useMemo(() => `pdf_highlights:${examCode}`, [examCode]);
    const { highlights, addHighlight } = usePdfHighlights(storageKey);

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(highlights));
        } catch {
            // ignore (quota /privacy mode)
        }
    }, [storageKey, highlights]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    // Documentに渡すwidthを設定するためのstate
    const [width, setWidth] = useState(0);
    const elementRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!elementRef.current) {
            return;
        }

        const handleResize = () => {
            setWidth(elementRef.current!.clientWidth);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(elementRef.current);

        // 初期値を設定
        handleResize();

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <PdfHighlighter ref={elementRef} onAddHighlight={addHighlight}>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Box
                        key={`page_${index + 1}`}
                        position="relative"
                        data-page-number={index + 1}
                    >
                        <Page
                            pageNumber={index + 1}
                            width={width}
                            renderTextLayer
                            renderAnnotationLayer={false}
                        />
                        {/* <PdfHighlightsOverlay
                            highlights={highlights}
                            page={index + 1}
                        /> */}
                    </Box>
                ))}
            </Document>
        </PdfHighlighter>
    );
});
