import { VStack, Button, Box, Text, Divider } from "@chakra-ui/react";
import { FC, memo, useEffect, Fragment, useMemo } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useAtomValue } from "jotai";

import { userAtom } from "../../states/userAtom";
import { NeedRegister } from "../molecules/NeedRegister";
import { RadioQuestionForm } from "../molecules/RadioQuestionForm";
import { CheckboxQuestionForm } from "../molecules/CheckboxQuestionForm";
import { InputQuestionForm } from "../molecules/InputQuestionForm";
import { TextareaQuestionForm } from "../molecules/TextareaQuestionForm";
import { Answer } from "../../types/form";
import { FetchedQuestion } from "../../types/exam";

export type Correction = {
    questionNumber: number;
    subQuestionNumber: number;
    aiRating: string;
    aiText: string;
    userText: string;
};

type Props = {
    year: number;
    season: string;
    section: number;
    questions: FetchedQuestion[];
    onSubmitAnswer: (answers: Answer[]) => Promise<void>;
    isCorrecting: boolean;
};

export const QuestionAndAnswerInput: FC<Props> = memo((props) => {
    const { year, season, section, questions, onSubmitAnswer, isCorrecting } =
        props;
    const user = useAtomValue(userAtom);
    const STORAGE_KEY = `formData-${year}-${season}-${section}`;

    const initialAnswers = useMemo(
        () =>
            questions.map((q) => ({
                questionCode: `${q.questionNumber}_${q.subQuestionNumber}_${q.smallQuestionNumber}`,
                content: q.type === "checkbox" ? [] : "",
            })),
        [questions],
    );

    const defaultAnswers = useMemo(() => {
        const storedData = sessionStorage.getItem(STORAGE_KEY);

        if (!storedData) {
            return initialAnswers;
        }

        try {
            return JSON.parse(storedData) as Answer[];
        } catch {
            sessionStorage.removeItem(STORAGE_KEY);
            return initialAnswers;
        }
    }, [STORAGE_KEY, initialAnswers]);

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<{ answers: Answer[] }>({
        defaultValues: {
            answers: defaultAnswers,
        },
    });

    const onSubmit: SubmitHandler<{ answers: Answer[] }> = async (data) => {
        await onSubmitAnswer(data.answers);

        // 提出後にフォームをリセット
        sessionStorage.removeItem(STORAGE_KEY);
        reset({ answers: initialAnswers });
    };

    // 入力が変更されたらsessionStorageに保存
    const answersWatch = useWatch({
        control,
        name: "answers",
    });

    useEffect(() => {
        if (answersWatch) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answersWatch));
        }
    }, [answersWatch, STORAGE_KEY]);

    return (
        <>
            {!user && (
                <Box textAlign="center" m="10px">
                    <Text color="red" fontWeight="bold">
                        答え合わせをするためにはログインが必要です
                    </Text>
                </Box>
            )}

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <VStack align="stretch">
                    {/* 設問をループ */}
                    {questions &&
                        questions.map((question, index) => (
                            <Fragment key={index}>
                                {question.subQuestionNumber == 1 &&
                                    question.smallQuestionNumber < 2 && (
                                        <Box>
                                            <Divider my="10px" />
                                            <Text>
                                                設問{question.questionNumber}
                                            </Text>
                                        </Box>
                                    )}

                                <Box mb="5px">
                                    {/* 質問文 */}
                                    <Text fontSize="md" whiteSpace="pre-line">
                                        {question.text}
                                    </Text>

                                    {/* 解答欄 */}
                                    {question.type === "radio" && (
                                        <RadioQuestionForm
                                            question={question}
                                            control={control}
                                            index={index}
                                        />
                                    )}

                                    {question.type === "checkbox" && (
                                        <CheckboxQuestionForm
                                            question={question}
                                            control={control}
                                            index={index}
                                        />
                                    )}

                                    {question.type === "textarea" && (
                                        <TextareaQuestionForm
                                            question={question}
                                            control={control}
                                            index={index}
                                        />
                                    )}

                                    {question.type === "input" && (
                                        <InputQuestionForm
                                            question={question}
                                            control={control}
                                            index={index}
                                        />
                                    )}
                                </Box>
                            </Fragment>
                        ))}

                    <Box textAlign="center" mt="20px">
                        {user ? (
                            <Button
                                type="submit"
                                backgroundColor="green.200"
                                borderRadius="100px"
                                w="80%"
                                isLoading={isCorrecting}
                                isDisabled={isCorrecting}
                            >
                                答え合わせ
                            </Button>
                        ) : (
                            <NeedRegister />
                        )}
                    </Box>
                </VStack>
            </form>
        </>
    );
});
