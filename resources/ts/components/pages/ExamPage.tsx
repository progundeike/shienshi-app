import { Box } from "@chakra-ui/react";
import { FC, memo, useEffect, useState, useRef, useCallback } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Split from "react-split";

import { ExamHeader } from "../molecules/ExamHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Page404 } from "./Page404";
import { DisplayExamPdf } from "../organisms/DisplayExamPdf";
import { AnswerAndCorrectionForm } from "../organisms/AnswerAndCorrectionForm";
import { useExam } from "../../hooks/useExam";
import { LoadingPage } from "./LoadingPage";

export const ExamPage: FC = memo(() => {
    const [loading, setLoading] = useState(true);
    const [isPdfExists, setIsPdfExists] = useState<boolean | null>(null);
    const { year, season, section } = useParams();

    // year, sectionを10進数でcastする
    const parsedYear = parseInt(year ?? "", 10);
    const parsedSection = parseInt(section ?? "", 10);

    const { checkPdfExists } = useExam();
    const navigate = useNavigate();

    if (isNaN(parsedYear) || !season || isNaN(parsedSection)) {
        return <Page404 />;
    }

    useEffect(() => {
        // PDFの存在確認
        const checkPdf = async () => {
            try {
                const exists = await checkPdfExists(
                    parsedYear,
                    season,
                    parsedSection
                );
                setIsPdfExists(exists);
                setLoading(false);
                if (!exists) {
                    navigate("/not-found");
                }
            } catch (error) {
                console.error("PDFの存在確認に失敗しました", error);
                navigate("/not-found");
            }
        };
        checkPdf();
    }, []);

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
                    backgroundColor="gray.300"
                    overflow={"auto"}
                >
                    <ExamHeader
                        year={parsedYear}
                        season={season}
                        section={parsedSection}
                    />
                    <DisplayExamPdf />
                </Box>

                {/* 右側 */}
                <Box
                    position="sticky"
                    top="0"
                    padding="2"
                    height="100vh"
                    overflowY="auto"
                    backgroundColor="white"
                    p="20px"
                >
                    <AnswerAndCorrectionForm
                        year={parsedYear}
                        season={season}
                        section={parsedSection}
                    />
                </Box>
            </Split>
        </Box>
    );
});
