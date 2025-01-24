import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import { FC, memo } from "react";
import { FetchedQuestion } from "../../hooks/useExam";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { AnswerInputs } from "../organisms/QuestionAndAnswerForm";

type Props = {
    question: FetchedQuestion;
    register: UseFormRegister<AnswerInputs>;
    watch: UseFormWatch<AnswerInputs>;
};

export const TextareaQuestionForm: FC<Props> = memo((props) => {
    const { question, register, watch } = props;

    return (
        <Box>
            <Flex alignItems="center" gap="10px">
                {/* 解答欄の左に表示する記号 [a]等 */}
                {question.options && (
                    <Text whiteSpace={"nowrap"}>
                        {question.options[0].label}
                    </Text>
                )}
                <Textarea
                    {...register(
                        `answer.${question.questionNumber}-${question.subQuestionNumber}-${question.smallQuestionNumber}`
                    )}
                />
            </Flex>

            {question.maxLength && (
                <Box textAlign="right">
                    (
                    {watch(
                        `answer.${question.questionNumber}-${question.subQuestionNumber}-${question.smallQuestionNumber}`,
                        ""
                    ).length || 0}
                    /{question.maxLength}
                    字)
                </Box>
            )}
        </Box>
    );
});
