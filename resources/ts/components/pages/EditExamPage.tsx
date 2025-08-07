import { Box, Button, Flex, Heading, Textarea } from "@chakra-ui/react";
import { FC, memo, useEffect, useState, useRef, useCallback } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Split from "react-split";

import { ExamHeader } from "../molecules/ExamHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Page404 } from "./Page404";
import { DisplayExamPdf } from "../organisms/DisplayExamPdf";
import { useExam } from "../../hooks/useExam";
import { LoadingPage } from "./LoadingPage";
import { RegisterQuestionForm } from "../organisms/RegisterQuestionForm";
import { ExamSentenceResponse, useAdmin } from "../../hooks/useAdmin";
import { EditExamSentenceForm } from "../molecules/EditExamSentenceForm";
import { EditPurposeForm } from "../molecules/EditPurposeForm";
import { EditReviewCommentForm } from "../molecules/EditReviewCommentForm";
import { PDFUploadFrom } from "../organisms/PDFUploadFrom";

export const EditExamPage: FC = memo(() => {
    const [loading, setLoading] = useState(true);
    const [isPdfExists, setIsPdfExists] = useState<boolean | null>(null);
    const [examData, setExamData] = useState<ExamSentenceResponse | null>(null);

    const { year, season, section } = useParams();

    // year, sectionを10進数でcastする
    const parsedYear = parseInt(year ?? "", 10);
    const parsedSection = parseInt(section ?? "", 10);

    const { checkPdfExists } = useExam();
    const { getExamSentence } = useAdmin();

    if (isNaN(parsedYear) || !season || isNaN(parsedSection)) {
        return <Page404 />;
    }

    // examSentenceを取得

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
            } catch (error) {
                console.error("PDFの存在確認に失敗しました", error);
            }
        };

        const checkExamSentence = async () => {
            try {
                const examSentence = await getExamSentence(
                    parsedYear,
                    season,
                    parsedSection
                );
                setExamData(examSentence);
            } catch (error) {
                console.error("問題文の存在確認に失敗しました", error);
            }
        };

        // 初期ロード時にPDFと問題文の存在確認を行う
        checkPdf();
        checkExamSentence();
        console.log("EditExamPage: useEffect called");
    }, []);

    return (
        <Box minH="100vh">
            <Split
                sizes={[50, 50]}
                minSize={100}
                gutterSize={10}
                gutterAlign="center"
                direction="horizontal"
                style={{ display: "flex", height: "100%" }} // Splitコンテナにスタイルを追加
            >
                {/* 左側のコンテナ */}
                <Box>
                    {/* TODO: ファイルがなくてもダウンロードボタンは表示される */}
                    <ExamHeader
                        year={parsedYear}
                        season={season}
                        section={parsedSection}
                    />

                    <PDFUploadFrom
                        year={parsedYear}
                        season={season}
                        section={parsedSection}
                    />
                    <Box
                        display="flex"
                        flexDirection="column"
                        height="50vh"
                        backgroundColor="gray.300"
                        overflow={"auto"}
                    >
                        <DisplayExamPdf />
                    </Box>

                    {/* テキスト化した問題文(examSentence)を編集するためのフォーム */}
                    <EditExamSentenceForm
                        year={parsedYear}
                        season={season}
                        section={parsedSection}
                        sentence={examData?.sentence ?? ""}
                    />

                    {/* 出題趣旨(purpose)を編集するためのフォーム */}
                    <EditPurposeForm
                        year={parsedYear}
                        season={season}
                        section={parsedSection}
                        purpose={examData?.purpose ?? ""}
                    />

                    {/* 採点講評(reviewComment)を編集するためのフォーム */}
                    <EditReviewCommentForm
                        year={parsedYear}
                        season={season}
                        section={parsedSection}
                        reviewComment={examData?.reviewComment ?? ""}
                    />
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
                    <RegisterQuestionForm
                        year={parsedYear}
                        season={season}
                        section={parsedSection}
                    />
                </Box>
            </Split>
        </Box>
    );
});
