import { Box, Button, Text, Textarea, Flex, Card } from "@chakra-ui/react";
import { FC, memo, useState } from "react";
import { set, useForm } from "react-hook-form";
import { useQuestion } from "../../hooks/useQuestion";
import { useParams } from "react-router-dom";
import { DialogueBox } from "../atoms/DialogueBox";
import { Dialogue } from "../../types/form";

type Props = {
    questionNumber: number;
    subQuestionNumber: number;
};

type Input = {
    message: string;
};

export const AskToAIArea: FC<Props> = memo((props) => {
    const { questionNumber, subQuestionNumber } = props;
    const [isOpen, setIsOpen] = useState(false);
    const { submitQuestion } = useQuestion();
    const { year, season, section } = useParams();
    const [dialogues, setDialogues] = useState<Dialogue[]>([]);
    const { register, handleSubmit, reset } = useForm<Input>();

    const onSubmit = async (data: Input) => {
        if (!year || !season || !section) {
            return;
        }

        setDialogues((prevDialogues) => [
            ...prevDialogues,
            { role: "user", message: data.message },
        ]);

        const response = await submitQuestion(
            parseInt(year),
            season,
            parseInt(section),
            questionNumber,
            subQuestionNumber,
            data.message
        );

        reset();

        if (!response) {
            return;
        }

        setDialogues((prevDialogues) => [
            ...prevDialogues,
            {
                role: "assistant",
                message: response,
            },
        ]);
    };

    console.log(dialogues);

    return (
        <>
            {isOpen ? (
                <Card p="10px" backgroundColor="yellow.50" mb="10px">
                    <Box>
                        <Flex direction="column" gap="5px">
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Text>この問題についてAIに質問する</Text>
                                <Button
                                    backgroundColor="red.100"
                                    onClick={() => setIsOpen(false)}
                                >
                                    X
                                </Button>
                            </Flex>

                            {/* 会話履歴を表示する */}
                            {dialogues.map((dialogue, index) => (
                                <DialogueBox key={index} dialogue={dialogue} />
                            ))}

                            <Textarea {...register("message")} />
                            <Flex justifyContent="flex-end">
                                <Button onClick={handleSubmit(onSubmit)}>
                                    質問を送信
                                </Button>
                            </Flex>
                        </Flex>
                    </Box>
                </Card>
            ) : (
                <Box>
                    <Button onClick={() => setIsOpen(true)} w="100%" mb="20px">
                        この問題についてAIに質問する
                    </Button>
                </Box>
            )}
        </>
    );
});
