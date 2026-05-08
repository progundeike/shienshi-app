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
    Text,
} from "@chakra-ui/react";
import { FC, memo, useEffect, useState } from "react";
import {
    Controller,
    SubmitHandler,
    useFieldArray,
    useForm,
} from "react-hook-form";
import { MainColorButton } from "../atoms/MainColorButton";
import { QuestionForEdit } from "../../hooks/useExam";
import { useAdmin } from "../../hooks/useAdmin";
import { QuestionFormInputs } from "../../types/form";

type Props = {
    examCode: string;
    isOpen: boolean;
    onClose: () => void;
    question: QuestionForEdit | null;
    onSuccess: () => void;
};

export const EditQuestionModal: FC<Props> = memo((props) => {
    const { examCode, isOpen, onClose, question, onSuccess } = props;
    const { updateExamQuestion, deleteQuestion } = useAdmin();
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // 問題編集用フォーム
    const { register, handleSubmit, setValue, reset, control } =
        useForm<QuestionFormInputs>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "options",
    });

    // 問題削除
    const onDelete = async () => {
        if (!question) return;
        try {
            await deleteQuestion.mutateAsync({
                examCode,
                questionCode: `${question.questionNumber}_${question.subQuestionNumber}_${question.smallQuestionNumber}`,
            });
            onSuccess();
            onClose();
            reset();
            setValidationErrors([]); // バリデーションエラーをリセット
        } catch (e) {
            console.error(e);
        }
    };

    // 問題編集用ハンドラー
    const handleUpdateExamQuestion: SubmitHandler<QuestionFormInputs> = async (
        data,
    ) => {
        try {
            const response = await updateExamQuestion({
                examCode,
                questionNumber: Number(data.questionNumber),
                subQuestionNumber: Number(data.subQuestionNumber),
                smallQuestionNumber: Number(data.smallQuestionNumber) ?? null,
                text: data.text,
                textForAi: data.textForAi ?? null,
                type: data.type,
                options: data.options ?? null,
                maxLength: data.maxLength ?? null,
            });

            // 成功時の処理
            if (response?.status === 201) {
                onSuccess();
                onClose();
                reset();
                setValidationErrors([]); // バリデーションエラーをリセット
            }

            // バリデーションエラーの場合
            if (response?.status === 422) {
                const errors = (response.data as any).errors || {}; // バリデーションエラーオブジェクトを取り出す。なければ空のオブジェクトを代入。
                const messages = Object.values(errors)
                    .flatMap(
                        (
                            value, // バリデーションエラーのメッセージを項目ごとに一つの配列に変換
                        ) => (Array.isArray(value) ? value : [value]),
                    )
                    .map(String); // 各エラーメッセージを文字列に変換
                setValidationErrors(messages);
            }
        } catch (e) {
            console.error(e);
        }
        return;
    };

    useEffect(() => {
        setValidationErrors([]); // モーダルが開かれたときにバリデーションエラーをリセット
        reset(); // フォームをリセット
        if (question) {
            setValue("questionNumber", question.questionNumber);
            setValue("subQuestionNumber", question.subQuestionNumber);
            setValue("smallQuestionNumber", question.smallQuestionNumber);
            setValue("text", question.text);
            setValue("textForAi", question.textForAi || "");
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
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay />
            <ModalContent w="60%">
                <ModalCloseButton />
                <ModalBody mt="40px">
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
                                                autoComplete="off"
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
                                                autoComplete="off"
                                                {...register(
                                                    "subQuestionNumber",
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
                                                autoComplete="off"
                                                {...register(
                                                    "smallQuestionNumber",
                                                )}
                                            />
                                        </InputGroup>
                                        <Text>
                                            ((1)等の問題のなかにさらに複数の問題がある場合)
                                        </Text>
                                    </Box>

                                    {/* 問題文 */}
                                    <Box>
                                        <Box>問題文</Box>
                                        <Textarea
                                            autoComplete="off"
                                            {...register("text")}
                                        />
                                    </Box>

                                    {/* AI専用の補助テキスト */}
                                    <Box>
                                        <Box>
                                            AI用の問題文(AIによる解答生成に使用する問題文です。ユーザーには表示されません。)
                                        </Box>
                                        <Textarea
                                            autoComplete="off"
                                            {...register("textForAi")}
                                        />
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
                                                <Flex
                                                    key={field.id}
                                                    gap="10px"
                                                    direction="row"
                                                    alignItems="flex-end"
                                                >
                                                    <Box>
                                                        {index == 0 && (
                                                            <Box>label</Box>
                                                        )}
                                                        <Textarea
                                                            rows={1}
                                                            placeholder="[a]"
                                                            autoComplete="off"
                                                            {...register(
                                                                `options.${index}.label`,
                                                            )}
                                                        />
                                                    </Box>

                                                    <Box>
                                                        {index == 0 && (
                                                            <Box>value</Box>
                                                        )}
                                                        <Textarea
                                                            rows={1}
                                                            placeholder="a"
                                                            autoComplete="off"
                                                            {...register(
                                                                `options.${index}.value`,
                                                            )}
                                                        />
                                                    </Box>

                                                    {/* 削除ボタン */}
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
                                                    autoComplete="off"
                                                    {...register("maxLength")}
                                                />
                                            </InputGroup>
                                        </Box>
                                    </Box>

                                    {/* バリデーションエラーの表示 */}
                                    {validationErrors.length > 0 && (
                                        <Box mt="10px" color="red.500">
                                            <Text>バリデーションエラー:</Text>
                                            {validationErrors.map(
                                                (error, index) => (
                                                    <Text key={index}>
                                                        ・{error}
                                                    </Text>
                                                ),
                                            )}
                                        </Box>
                                    )}

                                    <Flex
                                        w="80%"
                                        mx="auto"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box w="40%">
                                            <MainColorButton type="submit">
                                                {question ? "更新" : "追加"}
                                            </MainColorButton>
                                        </Box>
                                        {question && (
                                            <Box w="40%">
                                                <Button
                                                    colorScheme="red"
                                                    borderRadius="full"
                                                    ml="10px"
                                                    w="100%"
                                                    onClick={onDelete}
                                                >
                                                    削除
                                                </Button>
                                            </Box>
                                        )}
                                    </Flex>
                                </Flex>
                            </FormControl>
                        </Box>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
});
