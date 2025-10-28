import {
    Box,
    Button,
    Text,
    Textarea,
    Flex,
    Card,
    IconButton,
    Spinner,
} from "@chakra-ui/react";
import { FC, memo, useEffect, useState } from "react";
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
    const [isLoading, setIsLoading] = useState(false);
    const { submitQuestion, fetchDialogues, deleteDialogues } = useQuestion();
    const { year, season, section } = useParams();
    const [dialogues, setDialogues] = useState<Dialogue[]>([]);
    const { register, handleSubmit, reset } = useForm<Input>();

    const onClickDeleteDialogues = () => {
        if (!year || !season || !section) {
            return;
        }

        deleteDialogues(
            parseInt(year),
            season,
            parseInt(section),
            questionNumber,
            subQuestionNumber
        );
        setDialogues([]);
    };

    const onSubmit = async (data: Input) => {
        if (!year || !season || !section) {
            return;
        }

        setDialogues((prevDialogues) => [
            ...prevDialogues,
            { role: "user", content: data.message },
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
                content: response,
            },
        ]);
    };

    useEffect(() => {
        if (isOpen && year && season && section) {
            setIsLoading(true);

            fetchDialogues(
                parseInt(year),
                season,
                parseInt(section),
                questionNumber,
                subQuestionNumber
            )
                .then((data) => {
                    if (data) {
                        setDialogues(data);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isOpen, year, season, section, questionNumber, subQuestionNumber]);

    return (
        <>
            {/* {isLoading && <Spinner size="xl" />} */}

            {!isLoading && isOpen ? (
                <Card px="10px" pb="10px" backgroundColor="yellow.50" mb="10px">
                    <Box>
                        <Flex direction="column" gap="5px">
                            <Box ml="auto">
                                <IconButton
                                    aria-label="Close"
                                    icon={<RiCloseLargeFill />}
                                    onClick={() => setIsOpen(false)}
                                    borderRadius="100px"
                                    bg="transparent"
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
                                        onClick={onClickDeleteDialogues}
                                        mr="10px"
                                    >
                                        質問履歴を削除
                                    </Button>
                                )}

                                <Button
                                    rightIcon={<LuSend size="1.5rem" />}
                                    onClick={handleSubmit(onSubmit)}
                                    ml="auto"
                                    borderRadius="100px"
                                >
                                    質問を送信
                                </Button>
                            </Flex>
                        </Flex>
                    </Box>
                </Card>
            ) : (
                // <Box>
                //     <Button
                //         onClick={() => setIsOpen(true)}
                //         w="100%"
                //         mb="20px"
                //         borderRadius="100px"
                //     >
                //         この問題についてAIに質問する
                //     </Button>
                // </Box>
                <DisplayAskToAICard />
            )}
        </>
    );
});

export const DisplayAskToAICard: FC = () => {
    const onClick = () => {
        console.log("clicked");
    };

    return (
        <Box>
            <Button onClick={onClick} w="100%" mb="20px" borderRadius="100px">
                この問題についてAIに質問する
            </Button>
        </Box>
    );
};
