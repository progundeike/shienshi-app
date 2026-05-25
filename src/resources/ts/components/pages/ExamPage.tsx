import { Box, Link, useBreakpointValue } from "@chakra-ui/react";
import { FC, memo, useEffect, useState } from "react";
import Split from "react-split";

import { ExamHeader } from "../molecules/ExamHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Page404 } from "./Page404";
import { DisplayExamPdf } from "../organisms/DisplayExamPdf";
import { AnswerAndCorrectionForm } from "../organisms/AnswerAndCorrectionForm";
import { useExam } from "../../hooks/useExam";

export const ExamPage: FC = memo(() => {
    const [, setLoading] = useState(true);
    const [, setIsPdfExists] = useState<boolean | null>(null);
    const { year, season, section } = useParams();
    const isMobile = useBreakpointValue({ base: true, md: false });

    // year, sectionを10進数でcastする
    const parsedYear = parseInt(year ?? "", 10);
    const parsedSection = parseInt(section ?? "", 10);
    const examCode = `${parsedYear}_${season}_${parsedSection}`;
    const pdfUrl = `/storage/pdf/${parsedYear}/$${examCode}.pdf`;

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
                    parsedSection,
                );
                setIsPdfExists(exists);
                setLoading(false);
                if (!exists) {
                    navigate("/not-found");
                }
            } catch (error) {
                navigate("/not-found");
            }
        };
        checkPdf();
    }, []);

    if (isMobile) {
        return (
            <Box minH="100vh" p={4} fontSize="sm">
                <ExamHeader
                    year={parsedYear}
                    season={season}
                    section={parsedSection}
                />

                <AnswerAndCorrectionForm
                    year={parsedYear}
                    season={season}
                    section={parsedSection}
                />
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
                    backgroundColor="gray.300"
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
