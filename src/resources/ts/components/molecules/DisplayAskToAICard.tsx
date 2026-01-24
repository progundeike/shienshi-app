import { Box, Button } from "@chakra-ui/react";
import { FC, memo, useEffect, useState } from "react";
import { AskToAICard } from "../organisms/AskToAICard";

type Props = {
    examCode: string;
    questionCode: string;
};

export const DisplayAskToAICard: FC<Props> = memo((props) => {
    const { examCode, questionCode } = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box>
            {/* カードが閉じているときに表示するボタン */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    w="100%"
                    mb="20px"
                    borderRadius="100px"
                >
                    この問題についてAIに質問する
                </Button>
            )}

            {/* ボタンが押されたときに表示されるカード */}
            {isOpen && (
                <AskToAICard
                    examCode={examCode}
                    questionCode={questionCode}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </Box>
    );
});
