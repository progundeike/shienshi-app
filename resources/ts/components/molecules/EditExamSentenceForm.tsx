import { Box, Button, Heading, Textarea } from "@chakra-ui/react";
import { FC, memo, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Props = {
    examSentence: string;
};

type ExamSentenceForm = {
    examSentence: string;
};

export const EditExamSentenceForm: FC<Props> = memo((props) => {
    const { examSentence } = props;

    const { register, handleSubmit, reset } = useForm<ExamSentenceForm>({
        defaultValues: {
            examSentence: examSentence || "", // examSentenceが未登録の場合は空文字
        },
    });

    const onExamSentenceSubmit: SubmitHandler<ExamSentenceForm> = async (
        data
    ) => {
        // ここでexamSentenceを保存する処理を実装
        console.log("保存されたexamSentence:", data);
    };

    useEffect(() => {
        // フォームの初期値を更新
        reset({ examSentence });
    }, [examSentence]);

    return (
        <Box my="20px">
            <form onSubmit={handleSubmit(onExamSentenceSubmit)}>
                <Box mb="5px">
                    <Heading size="md">
                        テキスト化した問題文(examSentence)
                    </Heading>
                </Box>

                <Textarea
                    defaultValue={examSentence}
                    {...register("examSentence")}
                    placeholder="examSentenceが未登録です"
                    size="sm"
                    minH="200px"
                    resize="vertical"
                    mb="20px"
                    backgroundColor="white"
                    whiteSpace="pre" // 改行のみ反映、折り返さない
                    overflowX="auto" // 横スクロールを有効にする
                />

                <Box textAlign="right">
                    <Button
                        type="submit"
                        colorScheme="blue"
                        borderRadius="full"
                    >
                        保存
                    </Button>
                </Box>
            </form>
        </Box>
    );
});
