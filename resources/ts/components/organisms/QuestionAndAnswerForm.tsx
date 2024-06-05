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
import { FC, memo } from "react";
import { questionData } from "../../states/question";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAnswer } from "../../hooks/useAnswer";

export type AnswerInputs = {
    answer: {
        [id: string]: string;
    };
};

export const QuestionAndAnswerForm: FC = memo(() => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<AnswerInputs>();

    const { submitAnswer } = useAnswer();

    const onSubmit: SubmitHandler<AnswerInputs> = (data) => {
        console.log(questionData);
        submitAnswer(
            data,
            questionData[0].examYear,
            questionData[0].examSeason
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack align="stretch">
                {/* 設問をループ */}
                {questionData.map((questionsList, index) => (
                    <>
                        <Text key={index}>設問{questionsList.questionId}</Text>

                        {questionsList.questions.map((question, index) => (
                            <Box key={questionsList.questionId + index}>
                                {/* 質問文 */}
                                <Text fontSize="md">{question.text}</Text>

                                {/* 解答欄 */}
                                {question.type === "radio" ? (
                                    <RadioGroup>
                                        <Stack>
                                            {question.options?.map(
                                                (option, index) => (
                                                    <Radio
                                                        key={index}
                                                        value={option.value}
                                                        {...register(
                                                            `answer.${questionsList.questionId}-${question.subQuestionId}`
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
                                                `answer.${questionsList.questionId}-${question.subQuestionId}`
                                            )}
                                        />
                                        {question.maxLength && (
                                            <Box textAlign="right">
                                                (
                                                {watch(
                                                    `answer.${questionsList.questionId}-${question.subQuestionId}`,
                                                    ""
                                                ).length || 0}
                                                /{question.maxLength})
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>
                        ))}
                    </>
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
