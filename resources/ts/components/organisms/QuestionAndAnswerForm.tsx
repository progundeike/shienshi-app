import {
    VStack,
    RadioGroup,
    Stack,
    Radio,
    Button,
    Box,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { FC, Key, memo, useEffect, useState, Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAnswer } from "../../hooks/useAnswer";
import { FetchedQuestion, Option, useExam } from "../../hooks/useExam";
import { useNavigate } from "react-router-dom";

export type AnswerInputs = {
    answer: {
        [id: string]: string;
    };
};

export const QuestionAndAnswerForm: FC = memo(() => {
    const [questions, setQuestions] = useState<FetchedQuestion[] | null>(null);
    const navigate = useNavigate();
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
                                <Text fontSize="md">{question.text}</Text>

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
                                                            value={option.value}
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
                                                /{question.maxLength})
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Fragment>
                    ))}

                {/* 提出ボタン */}
                <Box textAlign="center" mt="20px">
                    <Button type="submit" backgroundColor="green.200">
                        答え合わせ
                    </Button>
                </Box>
            </VStack>
        </form>
    );
});
