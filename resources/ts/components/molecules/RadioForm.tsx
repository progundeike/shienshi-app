import { RadioGroup, Stack, Radio } from "@chakra-ui/react";
import { FC, memo } from "react";
import { Question } from "../../states/question";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
    question: Question;
    register: UseFormRegisterReturn;
};

export const RadioForm: FC<Props> = memo((Props) => {
    const { question, register } = Props;

    return (
        <RadioGroup>
            <Stack>
                {question.options?.map((option, index) => (
                    <Radio key={index} value={option.value} {...register}>
                        {option.label}
                    </Radio>
                ))}
            </Stack>
        </RadioGroup>
    );
});
