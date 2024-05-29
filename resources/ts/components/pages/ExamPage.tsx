import {
    Box,
    Flex,
    Input,
    Text,
    VStack,
    RadioGroup,
    Radio,
    Stack,
    Button,
    Heading,
} from "@chakra-ui/react";
import {
    FC,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState,
    useRef,
} from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Split from "react-split";

import { QuestionAndAnswerForm } from "../organisms/QuestionAndAnswerForm";
import { ExamHeader } from "../molecules/ExamHeader";

export const ExamPage: FC = memo(() => {
    const [numPages, setNumPages] = useState(1);
    const [leftPanelWidth, setLeftPanelWidth] = useState(0);
    const leftPanelRef = useRef<HTMLDivElement | null>(null);

    // Workerのパスを設定　現在はCDNを使用
    pdfjs.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs";

    const url = useMemo(
        () => `http://${window.location.host}/storage/pdf/test.pdf`,
        []
    );

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    useEffect(() => {
        if (leftPanelRef.current) {
            const handleResize = () => {
                setLeftPanelWidth(leftPanelRef.current?.clientWidth || 0);
            };

            const resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(leftPanelRef.current);

            // 初期値を設定
            handleResize();

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [leftPanelRef]);

    return (
        <Box minH="100vh">
            <Split
                sizes={[60, 40]}
                minSize={100}
                gutterSize={10}
                gutterAlign="center"
                direction="horizontal"
                style={{ display: "flex", height: "100%" }} // Splitコンテナにスタイルを追加
            >
                {/* 左側のコンテナ */}
                <Box
                    display="flex"
                    flexDirection="column"
                    height="100vh"
                    backgroundColor="green.200"
                    ref={leftPanelRef}
                    overflow={"auto"}
                >
                    <ExamHeader />
                    {/* PDF */}
                    <Box flex="3">
                        <Document
                            file={url}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            {Array.from(new Array(numPages), (el, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    width={leftPanelWidth}
                                />
                            ))}
                        </Document>
                    </Box>
                </Box>

                {/* 右側 */}
                <Box
                    flex="1"
                    position="sticky"
                    top="0"
                    padding="2"
                    height="100vh"
                    overflowY="auto"
                    backgroundColor="white"
                    p="20px"
                >
                    <QuestionAndAnswerForm />
                </Box>
            </Split>
        </Box>
    );
});
