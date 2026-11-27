import { Box, Button, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useExamPdfExists } from "../../hooks/useExamPdfExists";
import { DisplayExamPdf } from "../organisms/DisplayExamPdf";
import { LoadingPage } from "./LoadingPage";
import { Page404 } from "./Page404";
import { formatExamTitle } from "../../utils/examTitle";

export const ExamPdfWindowPage = () => {
    const { year = "", season = "", section = "" } = useParams();
    const { data, isPending, isError, isValid, refetch } = useExamPdfExists(year, season, section);

    useEffect(() => {
        if (!isValid) return;
        const previousTitle = document.title;
        document.title = `${formatExamTitle(Number(year), season, Number(section))}｜問題PDF`;
        return () => { document.title = previousTitle; };
    }, [year, season, section, isValid]);

    if (!isValid) return <Page404 />;
    if (isPending) return <LoadingPage />;
    if (isError) {
        return (
            <Box p={4} role="alert">
                <Text mb={3}>問題を確認できませんでした。通信状況をご確認ください。</Text>
                <Button onClick={() => void refetch()}>再試行</Button>
            </Box>
        );
    }
    if (!data) return <Page404 />;

    return (
        <Box h="100dvh" minH={0} overflow="hidden" bg="white">
            <DisplayExamPdf key={`${year}-${season}-${section}`} />
        </Box>
    );
};
