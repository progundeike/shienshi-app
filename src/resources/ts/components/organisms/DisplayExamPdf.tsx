import { Box, Flex } from "@chakra-ui/react";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { memo, useEffect, useRef, useState, type FC } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { useParams } from "react-router-dom";
// import { PdfHighlighter } from "./PdfHighlighter";
// import {
//     PdfHighlightsOverlay,
//     type AreaHighlight,
//     type NormRect,
// } from "./PdfHighlightsOverlay";
import { PdfToolbar } from "../molecules/PdfToolbar";

// type NewAreaHighlight = {
//     page: number;
//     rect: NormRect;
// };

import { PdfDrawingOverlay } from "./PdfDrawingOverlay";
import type { MarkerTool } from "../../types/PdfMarker";

// PDF.js Workerを読み込む
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const pdfOptions = {
    cMapUrl: "/build/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "/build/standard_fonts/",
};

export const DisplayExamPdf: FC = memo(() => {
    const [numPages, setNumPages] = useState(0);
    const { year, season, section } = useParams();
    const url =
        year && season && section
            ? `${window.location.origin}/storage/pdf/${year}/${year}_${season}_${section}.pdf`
            : null;

    // const [highlights, setHighlights] = useState<AreaHighlight[]>([]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const [tool, setTool] = useState<MarkerTool>("pointer");
    const [markerSize, setMarkerSize] = useState(1);
    // 値を変えると、全ページの描画領域を作り直してクリアする
    const [clearVersion, setClearVersion] = useState(0);

    // PDF表示の領域の幅。100%時をの基準にする。
    const [width, setWidth] = useState(0);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    // 拡大・縮小の倍率を管理するstate
    const [zoom, setZoom] = useState(100);

    // PDFの描画に使う倍率。操作終了時だけ更新する。
    const [appliedZoom, setAppliedZoom] = useState(100);

    const pageWidth = Math.max(1, Math.round(width * (appliedZoom / 100)));

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const handleResize = () => {
            // 非表示中は最後の幅を保持する。0にするとPageとマーカーが破棄される。
            if (viewport.clientWidth > 0) setWidth(viewport.clientWidth);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(viewport);

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
        <Flex h="100%" flexDirection="column" minH={0}>
            <Box flexShrink={0}>
                <PdfToolbar
                    zoom={zoom}
                    onZoomChange={setZoom}
                    onZoomChangeEnd={setAppliedZoom}
                    tool={tool}
                    onToolChange={setTool}
                    markerSize={markerSize}
                    onMarkerSizeChange={setMarkerSize}
                    onClear={() => setClearVersion((value) => value + 1)}
                />
            </Box>

            <Box ref={viewportRef} flex={1} minH={0} minW={0} overflow="auto">
                <Document
                    key={url}
                    file={url}
                    options={pdfOptions}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<Box p={4}>PDFを読み込んでいます...</Box>}
                    error={<Box>PDFを読み込めませんでした。</Box>}
                >
                    {width > 0 &&
                        Array.from({ length: numPages }, (_, index) => (
                            <Box
                                key={`page_${index + 1}`}
                                position="relative"
                                w={`${pageWidth}px`}
                            >
                                <Page
                                    pageNumber={index + 1}
                                    width={pageWidth}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />

                                <PdfDrawingOverlay
                                    key={`${url}:${index + 1}:${clearVersion}`}
                                    tool={tool}
                                    markerSize={markerSize}
                                    zoom={appliedZoom}
                                />
                            </Box>
                        ))}
                </Document>
            </Box>
        </Flex>
    );
});
