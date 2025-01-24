import { VStack, Button, Box, Text, Spinner, Center } from "@chakra-ui/react";
import { FC, memo, useEffect, useState, Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAtom, useAtomValue } from "jotai";

import { userAtom } from "../../states/userAtom";
import { useAnswer } from "../../hooks/useAnswer";
import { FetchedQuestion } from "../../hooks/useExam";
import { loadingAtom } from "../../states/loadingAtom";
import { NeedRegister } from "../molecules/NeedRegister";
import { RadioQuestionForm } from "../molecules/RadioQuestionForm";
import { CheckboxQuestionForm } from "../molecules/CheckboxQuestionForm";
import { InputQuestionForm } from "../molecules/InputQuestionForm";
import { TextareaQuestionForm } from "../molecules/TextareaQuestionForm";

export type AnswerInputs = {
    answer: {
        [id: string]: string;
    };
};

export type Correction = {
    questionNumber: number;
    subQuestionNumber: number;
    rating: string;
    comment: string;
    user_text: string;
};

type Props = {
    year: number;
    season: string;
    section: number;
    questions: FetchedQuestion[];
    setCorrections: (corrections: Correction[] | null) => void;
};

export const QuestionAndAnswerForm: FC<Props> = memo((props) => {
    const { year, season, section, questions, setCorrections } = props;
    const user = useAtomValue(userAtom);
    const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const STORAGE_KEY = `formData-${year}-${season}-${section}`;
    const storedData = sessionStorage.getItem(STORAGE_KEY);
    const defaultValues = storedData ? JSON.parse(storedData) : {};

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<AnswerInputs>({
        defaultValues: { answer: defaultValues },
    });

    const { submitAnswer } = useAnswer();

    // 入力が変更されたらsessionStorageに保存
    useEffect(() => {
        const subscription = watch((value) => {
            // `answer`の値だけを保存
            if (value.answer) {
                sessionStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(value.answer)
                );
            }
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    // sessionStorageからデータを復元
    useEffect(() => {
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log(parsedData);

            reset({ answer: parsedData });
        }
    }, [setValue]);

    const onSubmit: SubmitHandler<AnswerInputs> = async (data) => {
        try {
            const response = await submitAnswer(data, year, season, section);

            // sessionStorageをクリア
            sessionStorage.removeItem(STORAGE_KEY);

            if (response) {
                setCorrections(response);
            }
        } catch (e) {
            console.error(e);
        }

        return;
    };

    if (isLoading) {
        return (
            <Center mt="20px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!isLoading && !questions) {
        return (
            <Box>
                設問が取得できませんでした。しばらく経ってから再度お試しください
            </Box>
        );
    }

    return (
        <>
            {!user && (
                <Box textAlign="center" m="10px">
                    <Text color="red" fontWeight="bold">
                        答え合わせをするためにはログインが必要です。
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
                                        <Text>
                                            設問{question.questionNumber}
                                        </Text>
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
                                            register={register}
                                            watch={watch}
                                        />
                                    )}

                                    {question.type === "checkbox" && (
                                        <CheckboxQuestionForm
                                            question={question}
                                            register={register}
                                            watch={watch}
                                        />
                                    )}

                                    {question.type === "textarea" && (
                                        <TextareaQuestionForm
                                            question={question}
                                            register={register}
                                            watch={watch}
                                        />
                                    )}

                                    {question.type === "input" && (
                                        <InputQuestionForm
                                            question={question}
                                            register={register}
                                            watch={watch}
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
                            >
                                答え合わせ
                            </Button>
                        ) : (
                            <NeedRegister />
                        )}
                    </Box>

                    {/* テスト用入力リセットボタン */}
                    <Box>
                        <Button
                            colorScheme="red"
                            onClick={() => {
                                sessionStorage.removeItem(STORAGE_KEY);
                                reset();
                            }}
                        >
                            解答をリセット
                        </Button>
                    </Box>
                </VStack>
            </form>
        </>
    );
});
