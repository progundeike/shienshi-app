import { Box, Flex, Text, Input } from "@chakra-ui/react";
import { FC } from "react";
import { FetchedQuestion } from "../../types/exam";
import { Control, useController } from "react-hook-form";
import { Answer } from "../../types/form";

type Props = {
    question: FetchedQuestion;
    control: Control<{ answers: Answer[] }>;
    index: number;
};

export const InputQuestionForm: FC<Props> = (props) => {
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
        <Box>
            <Flex alignItems="center" gap="10px">
                {/* 解答欄の左に表示する記号 [a]等 */}
                {question.options && (
                    <Text whiteSpace={"nowrap"}>
                        {question.options[0].label}
                    </Text>
                )}
                <Input {...field} />
            </Flex>
            {question.maxLength && (
                <Box textAlign="right">
                    ({field.value.length}/{question.maxLength}
                    字)
                </Box>
            )}
        </Box>
    );
};
