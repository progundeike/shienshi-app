import { Box } from "@chakra-ui/react";
import { FC, memo, useEffect, useState, useRef } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Split from "react-split";

import { QuestionAndAnswerForm } from "../organisms/QuestionAndAnswerForm";
import { ExamHeader } from "../molecules/ExamHeader";
import { useParams } from "react-router-dom";
import { Page404 } from "./Page404";
import { CheckingAnswerArea } from "../organisms/ CheckingAnswerArea";
import { DisplayExamPdf } from "../organisms/DisplayExamPdf";
import { AnswerAndCorrectionForm } from "../organisms/AnswerAndCorrectionForm";

export const ExamPage: FC = memo(() => {
    const [leftPanelWidth, setLeftPanelWidth] = useState(0);
    const leftPanelRef = useRef<HTMLDivElement | null>(null);
    const { year, season, section } = useParams();

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

    if (!year || !season || !section) {
        return <Page404 />;
    }

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
                    <ExamHeader
                        year={parseInt(year)}
                        season={season}
                        section={parseInt(section)}
                    />
                    <Box flex="3">
                        <DisplayExamPdf leftPanelWidth={leftPanelWidth} />
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
                    <AnswerAndCorrectionForm
                        year={parseInt(year)}
                        season={season}
                        section={parseInt(section)}
                    />
                </Box>
            </Split>
        </Box>
    );
});
