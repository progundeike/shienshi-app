import { Box, Flex, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { FC, memo } from "react";
import { FetchedQuestion, Option } from "../../hooks/useExam";
import { Control, useController } from "react-hook-form";
import { AnswerInputs } from "../../types/form";

type Props = {
    question: FetchedQuestion;
    control: Control<AnswerInputs>;
};

export const RadioQuestionForm: FC<Props> = (props) => {
    const { question, control } = props;
    const code = `${question.questionNumber}_${question.subQuestionNumber}_${question.smallQuestionNumber}`;
    const fieldName: `answer.text.${string}` = `answer.text.${code}`;
    const { field } = useController<AnswerInputs, typeof fieldName>({
        name: fieldName,
        control,
        defaultValue: "",
    });

    return (
        <Box ml="20px">
            <RadioGroup value={field.value as string} onChange={field.onChange}>
                <Flex wrap="wrap" gap="20px" my="10px">
                    {question.options!.map((option: Option, index: number) => (
                        <Radio key={index} value={option.value}>
                            <Flex gap="10px" alignItems="center">
                                <Text whiteSpace="pre-wrap">
                                    {option.label}
                                </Text>
                            </Flex>
                        </Radio>
                    ))}
                </Flex>
            </RadioGroup>
        </Box>
    );
};
