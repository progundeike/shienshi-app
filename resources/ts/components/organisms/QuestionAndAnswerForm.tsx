import {
    VStack,
    RadioGroup,
    Stack,
    Radio,
    Button,
    Box,
    Text,
    Textarea,
    Flex,
    HStack,
    Center,
} from "@chakra-ui/react";
import { FC, memo, useEffect, useState, Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useAnswer } from "../../hooks/useAnswer";
import { FetchedQuestion, Option, useExam } from "../../hooks/useExam";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";

export type AnswerInputs = {
    answer: {
        [id: string]: string;
    };
};

export const QuestionAndAnswerForm: FC = memo(() => {
    const [questions, setQuestions] = useState<FetchedQuestion[] | null>(null);
    const user = useRecoilValue(userAtom);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<AnswerInputs>();
    const { fetchQuestions } = useExam();
    const { submitAnswer } = useAnswer();

    const onSubmit: SubmitHandler<AnswerInputs> = (data) => {
        console.log(questions);
        submitAnswer(data, questions![0].examYear, questions![0].examSeason);
    };

    useEffect(() => {
        fetchQuestions(2023, "aki", 1).then((data) => {
            if (data) {
                setQuestions(data);
            }
        });
    }, []);

    return (
        <>
            {!user && (
                <Box textAlign="center" m="10px">
                    <Text color="red" fontWeight="bold">
                        答え合わせをするためにはログインが必要です。
                    </Text>
                </Box>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="stretch">
                    {/* 設問をループ */}
                    {questions &&
                        questions.map((question, index) => (
                            <Fragment key={index}>
                                {question.subQuestionId == 1 && (
                                    <Text>設問{question.questionId}</Text>
                                )}

                                <Box>
                                    {/* 質問文 */}
                                    <Text fontSize="md" whiteSpace="pre-line">
                                        {question.text}
                                    </Text>

                                    {/* 解答欄 */}
                                    {question.type === "radio" ? (
                                        <RadioGroup>
                                            <Stack>
                                                {question.options &&
                                                    question.options.map(
                                                        (
                                                            option: Option,
                                                            index: number
                                                        ) => (
                                                            <Radio
                                                                key={index}
                                                                value={
                                                                    option.value
                                                                }
                                                                {...register(
                                                                    `answer.${question.questionId}-${question.subQuestionId}`
                                                                )}
                                                            >
                                                                {option.label}
                                                            </Radio>
                                                        )
                                                    )}
                                            </Stack>
                                        </RadioGroup>
                                    ) : (
                                        <>
                                            <Textarea
                                                {...register(
                                                    `answer.${question.questionId}-${question.subQuestionId}`
                                                )}
                                            />
                                            {question.maxLength && (
                                                <Box textAlign="right">
                                                    (
                                                    {watch(
                                                        `answer.${question.questionId}-${question.subQuestionId}`,
                                                        ""
                                                    ).length || 0}
                                                    /{question.maxLength}字)
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Fragment>
                        ))}

                    {/* 提出ボタン */}
                    <Box textAlign="center" mt="20px">
                        {user ? (
                            <Button type="submit" backgroundColor="green.200">
                                答え合わせ
                            </Button>
                        ) : (
                            <>
                                <Box mb="10px">
                                    <Text>
                                        答え合わせにはログインが必要です
                                    </Text>
                                </Box>
                                <Flex justifyContent="center" gap="20px">
                                    <Button
                                        type="submit"
                                        backgroundColor="green.200"
                                    >
                                        ログイン
                                    </Button>
                                    <Button
                                        type="submit"
                                        backgroundColor="blue.200"
                                    >
                                        ユーザー登録
                                    </Button>
                                </Flex>
                            </>
                        )}
                    </Box>
                </VStack>
            </form>
        </>
    );
});
