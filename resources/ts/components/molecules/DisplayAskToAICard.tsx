import { Box, Button } from "@chakra-ui/react";
import { FC, memo, useEffect, useState } from "react";
import { AskToAICard } from "../organisms/AskToAICard";

type Props = {
    questionNumber: number;
    subQuestionNumber: number;
    year: number;
    season: string;
    section: number;
};

export const DisplayAskToAICard: FC<Props> = memo((props) => {
    const { questionNumber, subQuestionNumber, year, season, section } = props;

    const [isOpen, setIsOpen] = useState(false);

    // const handleCloseCard = () => {
    //     setIsOpen(false);
    // };

    useEffect(() => {
        console.log(isOpen);
    }, [isOpen]);

    useEffect(() => {
        console.log("render");
    }, []);

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
                    questionNumber={questionNumber}
                    subQuestionNumber={subQuestionNumber}
                    year={year}
                    season={season}
                    section={section}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </Box>
    );
});
