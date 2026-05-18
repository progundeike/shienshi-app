import { Box, Checkbox, CheckboxGroup, Flex, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { Control, useController } from "react-hook-form";
import { Answer } from "../../types/form";
import { FetchedQuestion, Option } from "../../types/exam";

type Props = {
    question: FetchedQuestion;
    control: Control<{ answers: Answer[] }>;
    index: number;
};

export const CheckboxQuestionForm: FC<Props> = (props) => {
    const { question, control, index } = props;

    // questionCodeをフォームに固定で持たせる
    useController({
        name: `answers.${index}.questionCode`,
        control,
        defaultValue: question.questionCode,
    });

    const { field } = useController({
        name: `answers.${index}.content`,
        control,
        defaultValue: [],
    });

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
