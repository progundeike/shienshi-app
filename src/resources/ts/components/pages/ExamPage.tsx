import { Alert, AlertIcon, Box, Button, Flex, Link, Text, useBreakpointValue } from "@chakra-ui/react";
import { FC, memo, useEffect, useRef, useState } from "react";
import Split from "react-split";

import { ExamHeader } from "../molecules/ExamHeader";
import { ExamActions } from "../molecules/ExamActions";
import { useParams } from "react-router-dom";
import { Page404 } from "./Page404";
import { LoadingPage } from "./LoadingPage";
import { DisplayExamPdf } from "../organisms/DisplayExamPdf";
import { AnswerAndCorrectionForm } from "../organisms/AnswerAndCorrectionForm";
import { useExamPdfExists } from "../../hooks/useExamPdfExists";
import { ExamMemoWindow } from "../organisms/ExamMemoWindow";
import { createExamPdfWindowOpener } from "../../utils/examPdfWindow";

export const ExamPage: FC = memo(() => {
    const { year, season, section } = useParams();
    const { data: isPdfExists, isPending, isError, isValid, refetch } = useExamPdfExists(year, season, section);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const isDesktop = isMobile === false;
    const [desktopExamKey, setDesktopExamKey] = useState<string | null>(null);
    const pdfWindowOpener = useRef<ReturnType<typeof createExamPdfWindowOpener> | null>(null);
    const [popupBlocked, setPopupBlocked] = useState(false);
    const [isMemoOpen, setIsMemoOpen] = useState(false);
    const pdfWindowUrl = `/exams/${year}/${season}/${section}/pdf-window`;
    const memoStorageKey = `exam-memo-${year}-${season}-${section}`;
    // 一度PCで開いた問題だけ、モバイルでも部品を保持する。
    const retainDesktopView = isDesktop || desktopExamKey === memoStorageKey;

    useEffect(() => {
        if (isDesktop) setDesktopExamKey(memoStorageKey);
    }, [isDesktop, memoStorageKey]);

    const openQuestionWindow = () => {
        pdfWindowOpener.current ??= createExamPdfWindowOpener();
        setPopupBlocked(!pdfWindowOpener.current(pdfWindowUrl));
    };

    useEffect(() => {
        setPopupBlocked(false);
        setIsMemoOpen(false);
    }, [year, season, section]);

    useEffect(() => {
        if (isMobile) {
            setPopupBlocked(false);
            setIsMemoOpen(false);
        }
    }, [isMobile]);

    // year, sectionを10進数でcastする
    const parsedYear = parseInt(year ?? "", 10);
    const parsedSection = parseInt(section ?? "", 10);

    if (!isValid || !season) {
        return <Page404 />;
    }

    if (isPending) {
        return <LoadingPage />;
    }
    if (isError) {
        return (
            <Box p={4} role="alert">
                <Text mb={3}>問題を確認できませんでした。通信状況をご確認ください。</Text>
                <Button onClick={() => void refetch()}>再試行</Button>
            </Box>
        );
    }
    if (!isPdfExists) return <Page404 />;

    const windowNotice = popupBlocked ? (
        <Alert status="warning" flexShrink={0} fontSize="sm">
            <AlertIcon />
            <Box>
                別画面を開けませんでした。このサイトのポップアップを許可するか、
                <Link href={pdfWindowUrl} target="_blank" rel="noopener noreferrer" textDecoration="underline">
                    別タブで開く
                </Link>
                をお試しください。
            </Box>
        </Alert>
    ) : null;
    const examActions = (
        <ExamActions onOpenQuestionWindow={openQuestionWindow} onOpenMemo={() => setIsMemoOpen(true)} />
    );
    const memoWindow = (
        <ExamMemoWindow key={memoStorageKey} storageKey={memoStorageKey} isOpen={isDesktop && isMemoOpen} onClose={() => setIsMemoOpen(false)} />
    );

    return (
        <Box>
            <ExamHeader
                year={parsedYear}
                season={season}
                section={parsedSection}
                actions={isDesktop ? examActions : undefined}
            />
            {isDesktop && windowNotice}
            {!isDesktop && (
                <Box key="mobile-answers" minH="100vh" fontSize="sm" w="90%" mx="auto">
                    <Box p={2}>
                        <AnswerAndCorrectionForm
                            year={parsedYear}
                            season={season}
                            section={parsedSection}
                        />
                    </Box>
                </Box>
            )}
            {retainDesktopView && (
                <Flex
                    key={`desktop-${memoStorageKey}`}
                    display={{ base: "none", md: "flex" }}
                    direction="column"
                    h="100dvh"
                    minH={0}
                    overflow="hidden"
                >
                    <Split
                        sizes={[60, 40]}
                        minSize={100}
                        gutterSize={10}
                        gutterAlign="center"
                        direction="horizontal"
                        style={{
                            display: "flex",
                            flex: 1,
                            minHeight: 0,
                            overflow: "hidden",
                        }}
                    >
                        {/* 非表示中もPDFとマーカーの状態を保持する。 */}
                        <Box minW={0} h="100%" overflow="auto">
                            <DisplayExamPdf />
                        </Box>

                        <Box
                            minW={0}
                            h="100%"
                            overflowY="auto"
                            backgroundColor="white"
                            p={5}
                        >
                            {/* モバイル側との二重取得・ポーリングを避ける。 */}
                            {isDesktop && (
                                <AnswerAndCorrectionForm
                                    year={parsedYear}
                                    season={season}
                                    section={parsedSection}
                                />
                            )}
                        </Box>
                    </Split>
                </Flex>
            )}
            {retainDesktopView && memoWindow}
        </Box>
    );
});
