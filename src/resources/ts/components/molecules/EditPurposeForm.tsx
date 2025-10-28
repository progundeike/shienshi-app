import { Box, Button, Heading, Textarea } from "@chakra-ui/react";
import { FC, memo, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAdmin } from "../../hooks/useAdmin";

type Props = {
    year: number;
    season: string;
    section: number;
    purpose: string;
};

type PurposeForm = {
    purpose: string;
};

export const EditPurposeForm: FC<Props> = memo((props) => {
    const { year, season, section, purpose } = props;
    const { updateExamSentence } = useAdmin();

    const { register, handleSubmit, reset } = useForm<PurposeForm>({
        defaultValues: {
            purpose: purpose || "", // purposeが未登録の場合は空文字
        },
    });

    const onPurposeSubmit: SubmitHandler<PurposeForm> = async (data) => {
        updateExamSentence(year, season, section, null, data.purpose, null);
    };

    useEffect(() => {
        // フォームの初期値を更新
        reset({ purpose });
    }, [purpose]);

    return (
        <Box my="20px">
            <form onSubmit={handleSubmit(onPurposeSubmit)}>
                <Box mb="5px">
                    <Heading size="md">出題趣旨(purpose)</Heading>
                </Box>

                <Textarea
                    defaultValue={purpose}
                    {...register("purpose")}
                    placeholder="purposeが未登録です"
                    size="sm"
                    minH="50px"
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
