import { Box, Flex, Text, Input } from "@chakra-ui/react";
import { FC, memo } from "react";
import { FetchedQuestion, Option } from "../../hooks/useExam";
import { Control, useController } from "react-hook-form";
import { AnswerInputs } from "../../types/form";

type Props = {
    question: FetchedQuestion;
    control: Control<AnswerInputs>;
};

export const InputQuestionForm: FC<Props> = (props) => {
    const { question, control } = props;

    // 文字数のリアルタイム監視
    const code = `${question.questionNumber}_${question.subQuestionNumber}_${question.smallQuestionNumber}`;
    const fieldName: `answer.text.${string}` = `answer.text.${code}`;
    const { field } = useController<AnswerInputs, typeof fieldName>({
        name: fieldName,
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
