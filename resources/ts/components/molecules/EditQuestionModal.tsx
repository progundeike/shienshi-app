import {
    Box,
    FormControl,
    Flex,
    InputGroup,
    InputLeftAddon,
    Input,
    Textarea,
    RadioGroup,
    Radio,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
} from "@chakra-ui/react";
import { FC, memo, useEffect } from "react";
import {
    Controller,
    set,
    SubmitHandler,
    useFieldArray,
    useForm,
} from "react-hook-form";
import { MainColorButton } from "../atoms/MainColorButton";
import { FetchedQuestion, useExam } from "../../hooks/useExam";

type QuestionFormInputs = {
    questionNumber: number;
    subQuestionNumber: number;
    smallQuestionNumber: number | null;
    text: string;
    type: "radio" | "checkbox" | "input" | "textarea";
    options?: {
        label: string;
        value: string;
    }[];
    maxLength?: number | null;
};

type Props = {
    year: number;
    season: string;
    section: number;
    isOpen: boolean;
    onClose: () => void;
    question: FetchedQuestion | null;
};

export const EditQuestionModal: FC<Props> = memo((props) => {
    const { year, season, section, isOpen, onClose, question } = props;
    const { updateExamQuestion } = useExam();

    // 問題編集用フォーム
    const { register, handleSubmit, watch, setValue, reset, control } =
        useForm<QuestionFormInputs>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "options",
    });

    // 問題編集用ハンドラー
    const handleUpdateExamQuestion: SubmitHandler<QuestionFormInputs> = async (
        data
    ) => {
        try {
            updateExamQuestion({
                year,
                season,
                section,
                questionNumber: data.questionNumber,
                subQuestionNumber: data.subQuestionNumber,
                smallQuestionNumber: data.smallQuestionNumber ?? null,
                text: data.text,
                type: data.type,
                options: data.options ?? null,
                maxLength: data.maxLength ?? null,
            });
        } catch (e) {
            console.error(e);
        }
        // フォームをリセット
        // reset();
        return;
    };

    useEffect(() => {
        console.log(question);
        if (question) {
            setValue("questionNumber", question.questionNumber);
            setValue("subQuestionNumber", question.subQuestionNumber);
            setValue("smallQuestionNumber", question.smallQuestionNumber);
            setValue("text", question.text);
            setValue("type", question.type);
            setValue("maxLength", question.maxLength || null);
            if (question.options) {
                const options = question.options.map((option) => ({
                    label: option.label,
                    value: option.value,
                }));
                // optionsフィールドをリセットしてから新しいoptionsを追加
                remove(); // 既存のoptionsを削除
                options.forEach((option) => {
                    append(option);
                });
            }
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(handleUpdateExamQuestion)}>
                        <Box>
                            <FormControl>
                                <Flex direction="column" gap="20px">
                                    <Box>
                                        <InputGroup>
                                            <InputLeftAddon>
                                                questionNumber
                                            </InputLeftAddon>
                                            <Input
                                                placeholder="設問の番号"
                                                {...register("questionNumber")}
                                            />
                                        </InputGroup>
                                    </Box>

                                    <Box>
                                        <InputGroup>
                                            <InputLeftAddon>
                                                subQuestionNumber
                                            </InputLeftAddon>
                                            <Input
                                                placeholder="(1)などの設問内の番号"
                                                {...register(
                                                    "subQuestionNumber"
                                                )}
                                            />
                                        </InputGroup>
                                    </Box>

                                    <Box>
                                        <InputGroup>
                                            <InputLeftAddon>
                                                smallQuestionNumber
                                            </InputLeftAddon>
                                            <Input
                                                placeholder="(1)などの問題のなかにさらに複数の問題がある場合"
                                                {...register(
                                                    "smallQuestionNumber"
                                                )}
                                            />
                                        </InputGroup>
                                    </Box>

                                    {/* 問題文 */}
                                    <Box>
                                        <Box>問題文</Box>
                                        <Textarea {...register("text")} />
                                    </Box>

                                    {/* 問題の形式を選択 */}
                                    <Box>
                                        <Box>問題の形式を選択</Box>
                                        <Controller
                                            control={control}
                                            name="type"
                                            render={({ field }) => (
                                                <RadioGroup {...field}>
                                                    <Flex gap="20px">
                                                        <Radio value="radio">
                                                            radio
                                                        </Radio>
                                                        <Radio value="checkbox">
                                                            checkbox
                                                        </Radio>
                                                        <Radio value="input">
                                                            input
                                                        </Radio>
                                                        <Radio value="textarea">
                                                            textarea
                                                        </Radio>
                                                    </Flex>
                                                </RadioGroup>
                                            )}
                                        />
                                    </Box>

                                    {/* options */}
                                    <Box>
                                        <Box>optionsの追加</Box>

                                        {/* optionsのフィールドをループ */}
                                        <Flex direction="column" gap="10px">
                                            {fields.map((field, index) => (
                                                <Flex key={field.id} gap="10px">
                                                    <InputGroup>
                                                        <InputLeftAddon>
                                                            label
                                                        </InputLeftAddon>
                                                        <Input
                                                            placeholder="[a]"
                                                            {...register(
                                                                `options.${index}.label`
                                                            )}
                                                        />
                                                    </InputGroup>
                                                    <InputGroup>
                                                        <InputLeftAddon>
                                                            value
                                                        </InputLeftAddon>
                                                        <Input
                                                            placeholder="a"
                                                            {...register(
                                                                `options.${index}.value`
                                                            )}
                                                        />
                                                    </InputGroup>
                                                    <Box>
                                                        <Button
                                                            colorScheme="red"
                                                            onClick={() =>
                                                                remove(index)
                                                            }
                                                        >
                                                            -
                                                        </Button>
                                                    </Box>
                                                </Flex>
                                            ))}
                                        </Flex>

                                        <Box mt="10px">
                                            <Button
                                                colorScheme="blue"
                                                onClick={() =>
                                                    append({
                                                        label: "",
                                                        value: "",
                                                    })
                                                }
                                            >
                                                +
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* maxLength */}
                                    <Box>
                                        <Box>最大文字数の指定</Box>
                                        <Box>
                                            <InputGroup>
                                                <InputLeftAddon>
                                                    maxLength
                                                </InputLeftAddon>
                                                <Input
                                                    placeholder="最大文字数"
                                                    {...register("maxLength")}
                                                />
                                            </InputGroup>
                                        </Box>
                                    </Box>

                                    <Box w="50%" mx="auto">
                                        <MainColorButton type="submit">
                                            {question ? "更新" : "追加"}
                                        </MainColorButton>
                                    </Box>
                                </Flex>
                            </FormControl>
                        </Box>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
});
