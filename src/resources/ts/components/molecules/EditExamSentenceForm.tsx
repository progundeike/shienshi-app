import { Box, Button, Heading, Textarea } from "@chakra-ui/react";
import { FC, memo, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAdmin } from "../../hooks/useAdmin";

type Props = {
    sentence: string;
    year: number;
    season: string;
    section: number;
};

type ExamSentenceForm = {
    sentence: string;
};

export const EditExamSentenceForm: FC<Props> = memo((props) => {
    const { sentence, year, season, section } = props;
    const { updateExamSentence } = useAdmin();

    const { register, handleSubmit, reset } = useForm<ExamSentenceForm>({
        defaultValues: {
            sentence: sentence || "", // examSentenceが未登録の場合は空文字
        },
    });

    const onExamSentenceSubmit: SubmitHandler<ExamSentenceForm> = async (
        data
    ) => {
        updateExamSentence(year, season, section, data.sentence, null, null);
    };

    useEffect(() => {
        reset({ sentence });
    }, [sentence]);

    return (
        <Box my="20px">
            <form onSubmit={handleSubmit(onExamSentenceSubmit)}>
                <Box mb="5px">
                    <Heading size="md">
                        テキスト化した問題文(examSentence)
                    </Heading>
                </Box>

                <Textarea
                    defaultValue={sentence}
                    {...register("sentence")}
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
