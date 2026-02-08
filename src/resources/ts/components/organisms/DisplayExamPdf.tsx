import { Box } from "@chakra-ui/react";
import { FC, memo, useEffect, useMemo, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useParams } from "react-router-dom";

export const DisplayExamPdf: FC = memo(() => {
    const [numPages, setNumPages] = useState(1);
    const { year, season, section } = useParams();
    // Workerのパスを設定　現在はCDNを使用
    pdfjs.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs";

    const url = useMemo(
        () =>
            `http://${window.location.host}/storage/pdf/${year}/${year}_${season}_${section}.pdf`,
        []
    );

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
        <Box ref={elementRef}>
            <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={width}
                    />
                ))}
            </Document>
        </Box>
    );
});
