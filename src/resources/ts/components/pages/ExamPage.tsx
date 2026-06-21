import { Box, useBreakpointValue } from "@chakra-ui/react";
import { FC, memo, useEffect, useState } from "react";
import Split from "react-split";

import { ExamHeader } from "../molecules/ExamHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Page404 } from "./Page404";
import { LoadingPage } from "./LoadingPage";
import { DisplayExamPdf } from "../organisms/DisplayExamPdf";
import { AnswerAndCorrectionForm } from "../organisms/AnswerAndCorrectionForm";
import { useExam } from "../../hooks/useExam";

export const ExamPage: FC = memo(() => {
    const [isPdfExists, setIsPdfExists] = useState<boolean | null>(null);
    const { year, season, section } = useParams();
    const isMobile = useBreakpointValue({ base: true, md: false });

    // year, sectionを10進数でcastする
    const parsedYear = parseInt(year ?? "", 10);
    const parsedSection = parseInt(section ?? "", 10);

    const { checkPdfExists } = useExam();
    const navigate = useNavigate();

    const isInvalidParams =
        Number.isNaN(parsedYear) || !season || Number.isNaN(parsedSection);

    useEffect(() => {
        if (isInvalidParams) {
            return;
        }
        // PDFの存在確認
        const checkPdf = async () => {
            try {
                const exists = await checkPdfExists(
                    parsedYear,
                    season,
                    parsedSection,
                );
                setIsPdfExists(exists);
                if (!exists) {
                    navigate("/not-found");
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkPdf();
    }, [
        checkPdfExists,
        navigate,
        parsedYear,
        season,
        parsedSection,
        isInvalidParams,
    ]);

    if (isInvalidParams) {
        return <Page404 />;
    }

    if (isPdfExists !== true) {
        return <LoadingPage />;
    }

    if (isMobile) {
        return (
            <Box>
                <ExamHeader
                    year={parsedYear}
                    season={season}
                    section={parsedSection}
                />
                <Box minH="100vh" fontSize="sm" w="90%" mx="auto">
                    <Box p={2}>
                        <AnswerAndCorrectionForm
                            year={parsedYear}
                            season={season}
                            section={parsedSection}
                        />
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box h="100vh" overflow="hidden" minH={0}>
            <Split
                sizes={[60, 40]}
                minSize={100}
                gutterSize={10}
                gutterAlign="center"
                direction="horizontal"
                style={{ display: "flex", height: "100vh", minHeight: 0 }} // Splitコンテナにスタイルを追加
            >
                {/* 左側のコンテナ */}
                <Box
                    display="flex"
                    flexDirection="column"
                    h="100%"
                    minH={0}
                    overflow="auto"
                >
                    <Box flex="1" overflow="auto" minH={0}>
                        <ExamHeader
                            year={parsedYear}
                            season={season}
                            section={parsedSection}
                        />
                        <DisplayExamPdf />
                    </Box>
                </Box>

                {/* 右側 */}
                <Box
                    position="sticky"
                    top="0"
                    padding="2"
                    height="100vh"
                    overflowY="auto"
                    backgroundColor="white"
                    p={5}
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
