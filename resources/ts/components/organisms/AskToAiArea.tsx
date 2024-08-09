import { Box, Button, Heading } from "@chakra-ui/react";
import { FC, memo } from "react";

type Props = {
    // このコンポーネントに渡すpropsの型定義
    questionId: number;
    subQuestionId: number;
};

export const AskToAiArea: FC<Props> = memo((props) => {
    const { questionId, subQuestionId } = props;

    const handleClick = () => {
        // この関数はボタンがクリックされたときに呼ばれます
        console.log(questionId, subQuestionId);
    };

    return (
        <Box ml="auto" mb="15px">
            <Button onClick={handleClick}>この問題について質問する</Button>
        </Box>
    );
});
