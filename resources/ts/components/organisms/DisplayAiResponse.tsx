import { Box, Text } from "@chakra-ui/react";
import { FC, memo } from "react";

import { Correction } from "./QuestionAndAnswerForm";

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
        (res: any) =>
            res.questionNumber === questionNumber &&
            res.subQuestionNumber === subQuestionNumber &&
            res.smallQuestionNumber === smallQuestionNumber
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
                <Text></Text>
            </Box>
            <Box backgroundColor="yellow.200" mb="10px" p="5px">
                <Box>評価: {response.aiRating}</Box>
                <Box>{response.aiText}</Box>
            </Box>
        </Box>
    );
});
