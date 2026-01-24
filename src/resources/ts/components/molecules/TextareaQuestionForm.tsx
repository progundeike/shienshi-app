import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import { FC, memo } from "react";
import { FetchedQuestion } from "../../hooks/useExam";
import { Control, useController } from "react-hook-form";
import { AnswerItem } from "../../types/form";

type Props = {
    question: FetchedQuestion;
    control: Control<{ answers: AnswerItem[] }>;
    index: number;
};
export const TextareaQuestionForm: FC<Props> = (props) => {
    const { question, control, index } = props;

    // 文字数のリアルタイム監視
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
                <Textarea {...field} />
            </Flex>

            {question.maxLength && (
                <Box textAlign="right">
                    ({field.value.length}/{question.maxLength}字)
                </Box>
            )}
        </Box>
    );
};
