import { Box, Checkbox, CheckboxGroup, Flex, Stack } from "@chakra-ui/react";
import { FC, memo } from "react";
import { FetchedQuestion, Option } from "../../hooks/useExam";
import { Control, useController } from "react-hook-form";
import { AnswerInputs } from "../../types/form";

type Props = {
    question: FetchedQuestion;
    control: Control<AnswerInputs>;
};

export const CheckboxQuestionForm: FC<Props> = (props) => {
    const { question, control } = props;
    const code = `${question.questionNumber}_${question.subQuestionNumber}_${question.smallQuestionNumber}`;
    const fieldName: `answer.checkbox.${string}` = `answer.checkbox.${code}`;

    const { field } = useController({
        name: fieldName,
        control,
        defaultValue: [],
    });

    const checkboxValues = Array.isArray(field.value)
        ? field.value
        : [field.value];

    return (
        <Box ml="20px">
            <CheckboxGroup
                value={field.value as string[]}
                onChange={field.onChange}
            >
                <Flex wrap="wrap" gap="20px">
                    {question.options!.map((option: Option, index: number) => (
                        <Checkbox key={index} value={option.value}>
                            <Flex gap="10px" alignItems="center">
                                <Box>{option.label}</Box>
                            </Flex>
                        </Checkbox>
                    ))}
                </Flex>
            </CheckboxGroup>
        </Box>
    );
};
