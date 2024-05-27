import { Textarea, Box } from "@chakra-ui/react";
import { FC, memo, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
    maxLength: number;
};

type Input = {
    answer: string;
};

export const CountTextarea: FC<Props> = memo((Props) => {
    const { maxLength } = Props;
    // const [answerLength, setAnswerLength] = useState(0);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<Input>();
    const watchAnswer = watch("answer", "");

    return (
        <>
            <Textarea {...register("answer", { maxLength: maxLength })} />
            {maxLength && (
                <Box textAlign="right">
                    ({watchAnswer.length || 0}/{maxLength})
                </Box>
            )}
        </>
    );
});
