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
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { RadioForm } from "../molecules/RadioForm";

type Inputs = {
    answer: {
        [questionId: string]: string;
    };
};

export const QuestionAndAnswerForm: FC = memo(() => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
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
