import { Box, Button, Heading, Textarea } from "@chakra-ui/react";
import { FC, memo, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAdmin } from "../../hooks/useAdmin";

type Props = {
    year: number;
    season: string;
    section: number;
    reviewComment: string;
};

type ReviewCommentForm = {
    reviewComment: string;
};

export const EditReviewCommentForm: FC<Props> = memo((props) => {
    const { year, season, section, reviewComment } = props;
    const { updateExamSentence } = useAdmin(year, season, section);

    const { register, handleSubmit, reset } = useForm<ReviewCommentForm>({
        defaultValues: {
            reviewComment: reviewComment || "", // reviewCommentが未登録の場合は空文字
        },
    });

    const onReviewCommentSubmit: SubmitHandler<ReviewCommentForm> = async (
        data
    ) => {
        updateExamSentence(
            year,
            season,
            section,
            null,
            null,
            data.reviewComment
        );
    };

    useEffect(() => {
        // フォームの初期値を更新
        reset({ reviewComment });
    }, [reviewComment]);

    return (
        <Box my="20px">
            <form onSubmit={handleSubmit(onReviewCommentSubmit)}>
                <Box mb="5px">
                    <Heading size="md">採点講評(reviewComment)</Heading>
                </Box>

                <Textarea
                    defaultValue={reviewComment}
                    {...register("reviewComment")}
                    placeholder="reviewCommentが未登録です"
                    size="sm"
                    minH="100px"
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
