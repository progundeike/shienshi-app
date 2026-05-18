import { FC, memo, useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Box } from "@chakra-ui/react";

import { useExam } from "../../hooks/useExam";
import { userAtom } from "../../states/userAtom";
import { useAnswer } from "../../hooks/useAnswer";
import { LoadingPage } from "../pages/LoadingPage";
import { Correction, QuestionAndAnswerInput } from "./QuestionAndAnswerInput";
import { DisplayCorrections } from "./DisplayCorrections";
import { CorrectionLoadingSpinner } from "../molecules/CorrectionLoadingSpinner";
import { FetchedQuestion } from "../../types/exam";
import { Answer } from "../../types/form";

type Props = {
    year: number;
    season: string;
    section: number;
};

export const AnswerAndCorrectionForm: FC<Props> = memo((props) => {
    const { year, season, section } = props;
    const user = useAtomValue(userAtom);
    const { fetchQuestions, fetchPurposeAndReviewComment } = useExam();
    const [isCorrecting, setIsCorrecting] = useState(false);
    const { submitAnswer, checkAnswerProcessingStatus, fetchCorrection } =
        useAnswer();

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

    const {
        data: purposeAndReviewComment,
        isLoading: purposeAndReviewCommentLoading,
    } = useQuery({
        queryKey: ["purposeAndReviewComment", year, season, section],
        queryFn: async () => {
            const data = await fetchPurposeAndReviewComment(
                year,
                season,
                section,
            );

            return data;
        },
    });

    const checkProcessingStatus = useCallback(async (): Promise<boolean> => {
        try {
            const status = await checkAnswerProcessingStatus(
                year,
                season,
                section,
            );

            if (status === "processing") {
                setIsCorrecting(true);
                return true;
            }

            setIsCorrecting(false);
            return false;
        } catch (error) {
            console.error(error);
            setIsCorrecting(false);
            return false;
        }
    }, [checkAnswerProcessingStatus, year, season, section]);

    const handleSubmitAnswer = useCallback(
        async (answers: Answer[]) => {
            if (!user) {
                return;
            }

            setIsCorrecting(true);

            try {
                await submitAnswer(answers, year, season, section);
                const stillProcessing = await checkProcessingStatus();

                if (!stillProcessing) {
                    await refetchCorrections();
                }
            } catch (error) {
                console.error(error);
                setIsCorrecting(false);
            }
        },
        [
            user,
            submitAnswer,
            year,
            season,
            section,
            checkProcessingStatus,
            refetchCorrections,
        ],
    );

    useEffect(() => {
        if (!user) {
            return;
        }

        let intervalId: number | null = null;
        let cancelled = false;

        const startPolling = async () => {
            const isProcessing = await checkProcessingStatus();

            if (cancelled || !isProcessing) {
                return;
            }

            intervalId = window.setInterval(async () => {
                const stillProcessing = await checkProcessingStatus();

                if (!stillProcessing && intervalId) {
                    window.clearInterval(intervalId);
                    intervalId = null;
                    refetchCorrections();
                }
            }, 5000);
        };

        void startPolling();

        return () => {
            cancelled = true;
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [
        year,
        season,
        section,
        user,
        refetchCorrections,
        checkProcessingStatus,
    ]);

    // ローディング/エラー表示
    if (questionsLoading || correctionsLoading) {
        return <LoadingPage />;
    }

    if (questionError || !questions) {
        return <Box>設問を取得できませんでした</Box>;
    }

    // 添削中に表示するコンポーネント
    if (isCorrecting) {
        // if (true) {
        return (
            <CorrectionLoadingSpinner
                purpose={purposeAndReviewComment?.purpose ?? null}
                reviewComment={purposeAndReviewComment?.reviewComment ?? null}
                isPurposeAndReviewCommentLoading={
                    purposeAndReviewCommentLoading
                }
            />
        );
    }

    // 添削後に表示するコンポーネント
    if (user && corrections) {
        return (
            <DisplayCorrections
                year={year}
                season={season}
                section={section}
                questions={questions}
                corrections={corrections}
                refetchCollections={refetchCorrections}
                purpose={purposeAndReviewComment?.purpose ?? null}
                reviewComment={purposeAndReviewComment?.reviewComment ?? null}
            />
        );
    }

    // 添削前に表示するコンポーネント
    return (
        <QuestionAndAnswerInput
            year={year}
            season={season}
            section={section}
            questions={questions}
            onSubmitAnswer={handleSubmitAnswer}
            isCorrecting={isCorrecting}
        />
    );
});
