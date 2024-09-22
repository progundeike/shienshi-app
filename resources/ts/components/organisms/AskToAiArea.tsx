import {
    Box,
    Button,
    Text,
    Textarea,
    Flex,
    Card,
    IconButton,
} from "@chakra-ui/react";
import { FC, memo, useState } from "react";
import { set, useForm } from "react-hook-form";
import { useQuestion } from "../../hooks/useQuestion";
import { useParams } from "react-router-dom";
import { RiCloseLargeFill } from "react-icons/ri";
import { LuSend } from "react-icons/lu";

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
                            <Box ml="auto">
                                <IconButton
                                    aria-label="Close"
                                    icon={<RiCloseLargeFill />}
                                    onClick={() => setIsOpen(false)}
                                    // borderRadius="50%"
                                />
                            </Box>

                            {/* 会話履歴を表示する */}
                            {dialogues.map((dialogue, index) => (
                                <DialogueBox key={index} dialogue={dialogue} />
                            ))}

                            <Textarea
                                {...register("message")}
                                placeholder="質問を入力してください"
                            />
                            <Flex>
                                {dialogues.length > 0 && (
                                    <Button
                                        onClick={() => {
                                            setDialogues([]);
                                        }}
                                        mr="10px"
                                    >
                                        質問履歴を削除
                                    </Button>
                                )}

                                <Button
                                    rightIcon={<LuSend size="1.5rem" />}
                                    onClick={handleSubmit(onSubmit)}
                                    ml="auto"
                                >
                                    質問を送信
                                </Button>
                                {/* <IconButton
                                    aria-label="Send"
                                    icon={<LuSend size="1.5rem" />}
                                    onClick={handleSubmit(onSubmit)}
                                    borderRadius="50%"
                                    bgColor={"transparent"}
                                    color={"blue"}
                                /> */}
                                {/* <LuSend /> */}
                            </Flex>
                        </Flex>
                    </Box>
                </Card>
            ) : (
                <Box>
                    <Button
                        onClick={() => setIsOpen(true)}
                        w="100%"
                        mb="20px"
                        borderRadius="100px"
                    >
                        この問題についてAIに質問する
                    </Button>
                </Box>
            )}
        </>
    );
});
