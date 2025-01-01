import { FC, memo, useEffect, useState } from "react";
import { CheckingAnswerArea } from "./ CheckingAnswerArea";
import { Correction, QuestionAndAnswerForm } from "./QuestionAndAnswerForm";
import { FetchedQuestion, useExam } from "../../hooks/useExam";
import { useAtom, useAtomValue } from "jotai";
import { userAtom } from "../../states/userAtom";
import { loadingAtom } from "../../states/loadingAtom";
import { useAnswer } from "../../hooks/useAnswer";
import { Box, Center, Spinner } from "@chakra-ui/react";

type Props = {
    year: number;
    season: string;
    section: number;
};

export const AnswerAndCorrectionForm: FC<Props> = memo((props) => {
    const { year, season, section } = props;
    const [corrections, setCorrections] = useState<Correction[] | null>(null);
    const [questions, setQuestions] = useState<FetchedQuestion[] | null>(null);

    const user = useAtomValue(userAtom);
    const [isLoading, setIsLoading] = useAtom(loadingAtom);

    const { fetchQuestions } = useExam();
    const { fetchCorrection } = useAnswer();

    useEffect(() => {
        // 設問を取得
        fetchQuestions(year, season, section).then((data) => {
            if (data) {
                setQuestions(data);
            }
        });

        // ログイン済みの場合は、提出済み答案と添削結果を取得
        if (user) {
            fetchCorrection(year, season, section).then((data) => {
                if (data) {
                    setCorrections(data);
                }
            });
        }
    }, [user]);

    if (isLoading) {
        return (
            <Center mt="20px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!questions) {
        return <Box>設問を取得できませんでした</Box>;
    }

    return (
        <>
            {corrections && user ? (
                <>
                    {/* 解答後 */}
                    <CheckingAnswerArea
                        year={year}
                        season={season}
                        section={section}
                        questions={questions}
                        corrections={corrections}
                        setCorrections={setCorrections}
                        user={user}
                    />
                </>
            ) : (
                <>
                    {/* 解答前 */}
                    <QuestionAndAnswerForm
                        year={year}
                        season={season}
                        section={section}
                        questions={questions}
                        setCorrections={setCorrections}
                    />
                </>
            )}
        </>
    );
});
