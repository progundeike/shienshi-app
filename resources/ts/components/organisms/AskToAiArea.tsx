import { Box, Button, Text, Textarea, Flex, Card } from "@chakra-ui/react";
import { FC, memo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuestion } from "../../hooks/useQuestion";
import { useParams } from "react-router-dom";

type Props = {
    questionNumber: number;
    subQuestionNumber: number;
};

type Input = {
    question: string;
};

export const AskToAiArea: FC<Props> = memo((props) => {
    const { questionNumber, subQuestionNumber } = props;
    const [isOpen, setIsOpen] = useState(false);
    const { submitQuestion } = useQuestion();
    const { year, season, section } = useParams();

    const { register, handleSubmit } = useForm<Input>();

    const onSubmit = async (data: Input) => {
        if (!year || !season || !section) {
            return;
        }

        const response = await submitQuestion(
            parseInt(year),
            season,
            parseInt(section),
            questionNumber,
            subQuestionNumber,
            data.question
        );

        console.log(response);
    };

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

                            <Textarea {...register("question")} />
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
