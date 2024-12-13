import { Box, Flex, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { FC, memo } from "react";
import { FetchedQuestion, Option } from "../../hooks/useExam";
import { UseFormRegister } from "react-hook-form";
import { AnswerInputs } from "../organisms/QuestionAndAnswerForm";

type Props = {
    question: FetchedQuestion;
    register: UseFormRegister<AnswerInputs>;
};

export const RadioQuestionForm: FC<Props> = memo((props) => {
    const { question, register } = props;

    return (
        <RadioGroup>
            <Stack ml="20px">
                {question.options!.map((option: Option, index: number) => (
                    <Radio
                        key={index}
                        value={option.value}
                        {...register(
                            `answer.${question.questionNumber}-${question.subQuestionNumber}`
                        )}
                    >
                        <Flex gap="10px">
                            <Box>({option.value})</Box>
                            <Box>{option.label}</Box>
                        </Flex>
                    </Radio>
                ))}
            </Stack>
        </RadioGroup>
    );
});
