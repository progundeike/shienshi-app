import { FC, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Box } from "@chakra-ui/react";

import { Correction, QuestionAndAnswerForm } from "./QuestionAndAnswerForm";
import { FetchedQuestion, useExam } from "../../hooks/useExam";
import { userAtom } from "../../states/userAtom";
import { useAnswer } from "../../hooks/useAnswer";
import { LoadingPage } from "../pages/LoadingPage";
import { CheckingAnswerArea } from "./CheckingAnswerArea";

type Props = {
    year: number;
    season: string;
    section: number;
};

export const AnswerAndCorrectionForm: FC<Props> = memo((props) => {
    const { year, season, section } = props;
    const user = useAtomValue(userAtom);
    const { fetchQuestions } = useExam();
    const { fetchCorrection } = useAnswer();

    const {
        data: questions,
        isLoading: questionsLoading,
        isError: questionError,
    } = useQuery<FetchedQuestion[] | null, Error>({
        queryKey: ["questions", year, season, section],
        queryFn: async () => {
            const data = await fetchQuestions(year, season, section);
            return data;
        },
    });

    const {
        data: corrections,
        isLoading: correctionsLoading,
        isError: correctionError,
        refetch: refetchCorrections,
    } = useQuery<Correction[] | null, Error>({
        queryKey: ["corrections", year, season, section],
        queryFn: async () => {
            const data = await fetchCorrection(year, season, section);
            return data;
        },
        enabled: Boolean(user),
    });

    // ローディング/エラー表示
    if (questionsLoading || (user && correctionsLoading)) {
        return <LoadingPage />;
    }
    if (questionError || !questions) {
        return <Box>設問を取得できませんでした</Box>;
    }

    // console.log(corrections);

    return (
        <>
            {corrections && user ? (
                <CheckingAnswerArea
                    year={year}
                    season={season}
                    section={section}
                    questions={questions}
                    corrections={corrections}
                    refetchCollections={refetchCorrections}
                    user={user}
                />
            ) : (
                <QuestionAndAnswerForm
                    year={year}
                    season={season}
                    section={section}
                    questions={questions}
                    refetchCorrections={refetchCorrections}
                />
            )}
        </>
    );
});
