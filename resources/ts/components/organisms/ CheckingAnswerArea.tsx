import {
    VStack,
    Button,
    Box,
    Text,
    Textarea,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { FC, memo, useEffect, useState, Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAtom, useAtomValue } from "jotai";

import { useAnswer } from "../../hooks/useAnswer";
import { FetchedQuestion, Option, useExam } from "../../hooks/useExam";
import { DisplayAIResponse } from "./DisplayAIResponse";
import { loadingAtom } from "../../states/loadingAtom";
import { DisplayAskToAICard } from "../molecules/DisplayAskToAICard";
import { RadioQuestionForm } from "../molecules/RadioQuestionForm";
import { AnswerInputs, Correction } from "./QuestionAndAnswerForm";
import { User } from "../../types/user";

type Props = {
    year: number;
    season: string;
    section: number;
    questions: FetchedQuestion[];
    corrections: Correction[];
    user: User;
};

// 添削結果を表示するコンポーネント
export const CheckingAnswerArea: FC<Props> = memo((props) => {
    const { year, season, section, questions, corrections } = props;
    const [isLoading, setIsLoading] = useAtom(loadingAtom);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AnswerInputs>();

    const { deleteSubmittedAnswer } = useAnswer();

    const onReset = () => {
        // ToDo: correctionsを初期化
        // setCorrections(null);

        deleteSubmittedAnswer(year, season, section);
        reset();
    };

    if (isLoading) {
        return (
            <Center mt="20px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!questions) {
        return (
            <Box>
                設問が取得できませんでした。しばらく経ってから再度お試しください
            </Box>
        );
    }

    return (
        <>
            <form>
                <VStack align="stretch">
                    {/* 設問をループ */}
                    {questions &&
                        questions.map((question, index) => (
                            <Fragment key={index}>
                                {(question.subQuestionNumber == 1 ||
                                    question.subQuestionNumber == 0) && (
                                    <Text>設問{question.questionNumber}</Text>
                                )}

                                <Box>
                                    {/* 質問文 */}
                                    <Text fontSize="md" whiteSpace="pre-line">
                                        {question.text}
                                    </Text>

                                    {/* 解答欄 */}
                                    {/* ラジオボタンの問題は解答後も表示する */}
                                    {question.type === "radio" && (
                                        <RadioQuestionForm
                                            question={question}
                                            register={register}
                                        />
                                    )}
                                </Box>

                                <DisplayAIResponse
                                    questionNumber={question.questionNumber}
                                    subQuestionNumber={
                                        question.subQuestionNumber
                                    }
                                    aiResponse={corrections}
                                />

                                <DisplayAskToAICard
                                    questionNumber={question.questionNumber}
                                    subQuestionNumber={
                                        question.subQuestionNumber
                                    }
                                    year={question.year}
                                    season={question.season}
                                    section={question.section}
                                />
                            </Fragment>
                        ))}

                    <Box textAlign="center" mt="20px">
                        <Box>
                            <Button
                                backgroundColor="green.200"
                                borderRadius="100px"
                                w="80%"
                                onClick={onReset}
                            >
                                解き直す
                            </Button>
                        </Box>
                    </Box>
                </VStack>
            </form>
        </>
    );
});
