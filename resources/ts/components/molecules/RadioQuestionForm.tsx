import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { FC, memo } from "react";
import { FetchedQuestion, Option } from "../../hooks/useExam";
import { UseFormRegister } from "react-hook-form";
import { AnswerInputs } from "../organisms/QuestionAndAnswerForm";

type Props = {
    question: FetchedQuestion;
    register: UseFormRegister<AnswerInputs>;
};

export const RadioQuestionForm: FC<Props> = memo((props) => {
    const { question, register } = props;

    return (
        <RadioGroup>
            <Stack>
                {question.options!.map((option: Option, index: number) => (
                    <Radio
                        key={index}
                        value={option.value}
                        {...register(
                            `answer.${question.questionNumber}-${question.subQuestionNumber}`
                        )}
                    >
                        {option.label}
                    </Radio>
                ))}
            </Stack>
        </RadioGroup>
    );
});
