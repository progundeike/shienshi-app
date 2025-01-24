import { Box, Checkbox, CheckboxGroup, Flex, Stack } from "@chakra-ui/react";
import { FC, memo } from "react";
import { FetchedQuestion, Option } from "../../hooks/useExam";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { AnswerInputs } from "../organisms/QuestionAndAnswerForm";

type Props = {
    question: FetchedQuestion;
    register: UseFormRegister<AnswerInputs>;
    watch: UseFormWatch<AnswerInputs>;
};

export const CheckboxQuestionForm: FC<Props> = memo((props) => {
    const { question, register, watch } = props;
    const fieldName: `answer.${string}` = `answer.${question.questionNumber}-${question.subQuestionNumber}-${question.smallQuestionNumber}`;
    const currentValue = watch(fieldName) || [];

    return (
        <Box ml="20px">
            <CheckboxGroup defaultValue={currentValue as string[]}>
                <Flex wrap="wrap" gap="20px">
                    {question.options!.map((option: Option, index: number) => (
                        <Checkbox
                            key={index}
                            value={option.value}
                            {...register(fieldName)}
                        >
                            <Flex gap="10px" alignItems="center">
                                <Box>{option.label}</Box>
                            </Flex>
                        </Checkbox>
                    ))}
                </Flex>
            </CheckboxGroup>
        </Box>
    );
});
