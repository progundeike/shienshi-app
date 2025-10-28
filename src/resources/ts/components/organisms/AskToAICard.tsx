import {
    Card,
    Box,
    Flex,
    IconButton,
    Textarea,
    Button,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { FC, memo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuSend } from "react-icons/lu";
import { RiCloseLargeFill } from "react-icons/ri";
import { useQuestion } from "../../hooks/useQuestion";
import { Dialogue } from "../../types/form";
import { DialogueBox } from "../atoms/DialogueBox";

type Props = {
    questionNumber: number;
    subQuestionNumber: number;
    year: number;
    season: string;
    section: number;
    onClose: () => void;
};

type Input = {
    message: string;
};

export const AskToAICard: FC<Props> = memo((props) => {
    const {
        questionNumber,
        subQuestionNumber,
        year,
        season,
        section,
        onClose,
    } = props;

    const [isLoading, setIsLoading] = useState(false);
    const { submitQuestion, fetchDialogues, deleteDialogues } = useQuestion();
    const [dialogues, setDialogues] = useState<Dialogue[]>([]);
    const { register, handleSubmit, reset } = useForm<Input>();

    const onClickDeleteDialogues = () => {
        deleteDialogues(
            year,
            season,
            section,
            questionNumber,
            subQuestionNumber
        );

        setDialogues([]);
    };

    const onSubmit = async (data: Input) => {
        setDialogues((prevDialogues) => [
            ...prevDialogues,
            { role: "user", content: data.message },
        ]);

        const response = await submitQuestion(
            year,
            season,
            section,
            questionNumber,
            subQuestionNumber,
            data.message
        );

        reset(); //入力フォームをリセット

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
        setIsLoading(true);

        fetchDialogues(year, season, section, questionNumber, subQuestionNumber)
            .then((data) => {
                if (data) {
                    setDialogues(data);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);
    //
    return (
        <Card px="10px" pb="10px" backgroundColor="yellow.50" mb="10px">
            <Box>
                <Flex direction="column" gap="5px">
                    <Box ml="auto">
                        <IconButton
                            aria-label="Close"
                            icon={<RiCloseLargeFill />}
                            onClick={onClose}
                            borderRadius="100px"
                            bg="transparent"
                        />
                    </Box>

                    {/* 会話履歴を表示する */}
                    {isLoading ? (
                        <Center m="20px">
                            <Spinner size="xl" />
                        </Center>
                    ) : (
                        <>
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
                        </>
                    )}
                </Flex>
            </Box>
        </Card>
    );
});
