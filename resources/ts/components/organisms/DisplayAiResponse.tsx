import { Box } from "@chakra-ui/react";
import { FC, memo } from "react";

type Props = {
    aiResponse: {
        questionNumber: number;
        subQuestionNumber: number;
        rating: string;
        comment: string;
    }[];
    questionNumber: number;
    subQuestionNumber: number;
};

export const DisplayAiResponse: FC<Props> = memo((Props) => {
    const { aiResponse, questionNumber, subQuestionNumber } = Props;

    const response = aiResponse.find(
        (res: any) =>
            res.questionNumber === questionNumber &&
            res.subQuestionNumber === subQuestionNumber
    );

    if (!response) return null;

    return (
        <Box backgroundColor="yellow.200" mb="10px" p="5px">
            <Box>評価: {response.rating}</Box>
            <Box>{response.comment}</Box>
        </Box>
    );
});
