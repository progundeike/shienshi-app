import { Box, Text } from "@chakra-ui/react";
import { FC, memo } from "react";

import { Correction } from "./QuestionAndAnswerInput";

type Props = {
    corrections: Correction[];
    questionNumber: number;
    subQuestionNumber: number;
    smallQuestionNumber: number;
};

export const DisplayAIResponse: FC<Props> = memo((Props) => {
    const {
        corrections,
        questionNumber,
        subQuestionNumber,
        smallQuestionNumber,
    } = Props;

    const response = corrections.find(
        (res) =>
            res.questionNumber === questionNumber &&
            res.subQuestionNumber === subQuestionNumber &&
            res.smallQuestionNumber === smallQuestionNumber,
    );

    if (!response) return null;

    return (
        <Box>
            <Box>
                <Text>
                    {`あなたの解答: ${
                        response.userText ? response.userText : "提出なし"
                    }`}
                </Text>
            </Box>
            <Box backgroundColor="yellow.200" mb="10px" p="5px">
                <Text>
                    模範解答: {response.modelAnswer || "取得できませんでした"}
                </Text>
                <Box>評価: {response.aiRating}</Box>
                <Box whiteSpace="pre-wrap">{response.aiText}</Box>
            </Box>
        </Box>
    );
});
