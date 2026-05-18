import { Box, Flex, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { FC, memo } from "react";
import { FetchedQuestion, Option } from "../../types/exam";
import { Control, useController } from "react-hook-form";
import { Answer } from "../../types/form";

type Props = {
    question: FetchedQuestion;
    control: Control<{ answers: Answer[] }>;
    index: number;
};

export const RadioQuestionForm: FC<Props> = (props) => {
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
