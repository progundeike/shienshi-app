import { Box } from "@chakra-ui/react";
import { FC, memo } from "react";

type Props = {
    aiResponse: {
        questionId: number;
        subQuestionId: number;
        rating: string;
        comment: string;
    }[];
    questionId: number;
    subQuestionId: number;
};

export const DisplayAiResponse: FC<Props> = memo((Props) => {
    const { aiResponse, questionId, subQuestionId } = Props;

    const response = aiResponse.find(
        (res: any) =>
            res.questionId === questionId && res.subQuestionId === subQuestionId
    );

    if (!response) return null;

    return (
        <Box backgroundColor="yellow.200" mb="10px" p="5px">
            <Box>評価: {response.rating}</Box>
            <Box>{response.comment}</Box>
        </Box>
    );
});
