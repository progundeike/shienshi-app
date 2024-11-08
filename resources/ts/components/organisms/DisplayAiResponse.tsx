import { Box, Text } from "@chakra-ui/react";
import { FC, memo } from "react";

import { Correction } from "./QuestionAndAnswerForm";

type Props = {
    aiResponse: Correction[];
    questionNumber: number;
    subQuestionNumber: number;
};

export const DisplayAIResponse: FC<Props> = memo((Props) => {
    const { aiResponse, questionNumber, subQuestionNumber } = Props;

    const response = aiResponse.find(
        (res: any) =>
            res.questionNumber === questionNumber &&
            res.subQuestionNumber === subQuestionNumber
    );

    if (!response) return null;

    return (
        <Box>
            <Box>
                <Text>
                    あなたの解答:{" "}
                    {response.user_text ? response.user_text : "提出なし"}
                </Text>
                <Text></Text>
            </Box>
            <Box backgroundColor="yellow.200" mb="10px" p="5px">
                <Box>評価: {response.rating}</Box>
                <Box>{response.comment}</Box>
            </Box>
        </Box>
    );
});
