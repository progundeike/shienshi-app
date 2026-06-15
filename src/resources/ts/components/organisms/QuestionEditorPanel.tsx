import {
    Box,
    Button,
    Divider,
    VStack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { FC, Fragment, memo, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

import { QuestionForEdit } from "../../types/exam";
import { CheckboxQuestionForm } from "../molecules/CheckboxQuestionForm";
import { InputQuestionForm } from "../molecules/InputQuestionForm";
import { RadioQuestionForm } from "../molecules/RadioQuestionForm";
import { TextareaQuestionForm } from "../molecules/TextareaQuestionForm";
import { EditQuestionModal } from "./EditQuestionModal";
import { useAdmin } from "../../hooks/useAdmin";
import { LoadingPage } from "../pages/LoadingPage";
import { Answer } from "../../types/form";

export const QuestionEditorPanel: FC<{ examCode: string }> = memo((props) => {
    const { examCode } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editTargetQuestion, setEditTargetQuestion] =
        useState<QuestionForEdit | null>(null);

    const { handleSubmit, reset, control } = useForm<{ answers: Answer[] }>({
        defaultValues: { answers: [] },
    });
    const qc = useQueryClient();

    const { getModelAnswers, updateModelAnswers, getQuestionsForEdit } =
        useAdmin();
    const questionsQuery = useQuery({
        queryKey: ["questions", examCode],
        queryFn: () => getQuestionsForEdit(examCode),
    });
    const modelAnswersQuery = useQuery({
        queryKey: ["modelAnswers", examCode],
        queryFn: () => getModelAnswers(examCode),
    });

    // 模範解答提出ハンドラー
    const onModelAnswerSubmit: SubmitHandler<{ answers: Answer[] }> = async (
        data,
    ) => {
        updateModelAnswers.mutate({ examCode, modelAnswers: data } as any, {
            onSuccess: () => {
                reset(); // フォームをクリア

                // ReactQueryのキャッシュを無効化して再取得
                qc.invalidateQueries({
                    queryKey: ["modelAnswers", examCode],
                });
            },
        });
    };

    // modelAnswersをフォーム初期値に反映
    useEffect(() => {
        const questionsData = questionsQuery.data;
        if (!questionsData) return;
        const modelAnswersData = modelAnswersQuery.data ?? [];
        const byCode = new Map(
            modelAnswersData.map((ma) => [ma.questionCode, ma.text]),
        );

        const initialValues: Answer[] = questionsData.map((question) => ({
            questionCode: question.questionCode,
            content:
                question.type === "checkbox"
                    ? (byCode.get(question.questionCode)?.split(",") ?? [])
                    : (byCode.get(question.questionCode) ?? ""),
        }));

        reset({ answers: initialValues });
    }, [modelAnswersQuery.data, questionsQuery.data, reset]);

    if (questionsQuery.isLoading || modelAnswersQuery.isLoading) {
        return <LoadingPage />;
    }

    return (
        <Box>
            {/* 問題が登録されていれば、問題を表示 */}
            <form
                autoComplete="off"
                onSubmit={handleSubmit(onModelAnswerSubmit)}
            >
                <VStack align="stretch">
                    {/* 設問をループ */}
                    {questionsQuery.data &&
                        questionsQuery.data.map((question, index) => (
                            <Fragment key={index}>
                                {question.subQuestionNumber == 1 &&
                                    question.smallQuestionNumber < 2 && (
                                        <Box>
                                            <Divider my="10px" />
                                            <Text>
                                                設問{question.questionNumber}
                                            </Text>
                                        </Box>
                                    )}
                                <Box fontWeight="bold">
                                    {question.questionCode}
                                </Box>

                                <Box mb="5px">
                                    {/* 質問文 */}
                                    <Text fontSize="md" whiteSpace="pre-line">
                                        {question.text}
                                    </Text>

                                    {/* AI専用のテキスト */}
                                    <Box
                                        my="10px"
                                        backgroundColor={"gray.100"}
                                        p="10px"
                                        borderRadius="md"
                                    >
                                        <Text>text_for_ai</Text>
                                        <Text
                                            fontSize="md"
                                            whiteSpace="pre-line"
                                        >
                                            {question.textForAi}
                                        </Text>
                                    </Box>

                                    {/* 解答欄 */}
                                    {question.type === "radio" && (
                                        <RadioQuestionForm
                                            question={question}
                                            control={control}
                                            index={index}
                                        />
                                    )}

                                    {question.type === "checkbox" && (
                                        <CheckboxQuestionForm
                                            question={question}
                                            control={control}
                                            index={index}
                                        />
                                    )}

                                    {question.type === "textarea" && (
                                        <TextareaQuestionForm
                                            question={question}
                                            control={control}
                                            index={index}
                                        />
                                    )}

                                    {question.type === "input" && (
                                        <InputQuestionForm
                                            question={question}
                                            control={control}
                                            index={index}
                                        />
                                    )}
                                </Box>

                                {/* 編集ボタン */}
                                <Box w="100%" textAlign="right" mb="10px">
                                    <Button
                                        colorScheme="green"
                                        borderRadius="full"
                                        onClick={() => {
                                            setEditTargetQuestion(question);
                                            onOpen(); // 問題編集モーダルを開く
                                        }}
                                    >
                                        問題を編集
                                    </Button>
                                </Box>
                            </Fragment>
                        ))}

                    <Box w="100%" textAlign="center">
                        <Button
                            w="80%"
                            borderRadius="full"
                            colorScheme="green"
                            type="submit"
                        >
                            模範解答を提出
                        </Button>
                    </Box>
                </VStack>
            </form>

            <Divider my="10px" />

            {/* 問題を追加するためのフォーム */}
            <Box w="80%" mx="auto" my="20px">
                <Button
                    w="100%"
                    onClick={() => {
                        setEditTargetQuestion(null);
                        onOpen();
                    }}
                    colorScheme="blue"
                    borderRadius="full"
                >
                    問題追加
                </Button>
            </Box>

            <EditQuestionModal
                examCode={examCode}
                isOpen={isOpen}
                onClose={onClose}
                question={editTargetQuestion}
                onSuccess={async () => {
                    // 問題が追加された後に再度問題を取得
                    qc.invalidateQueries({
                        queryKey: ["questions", examCode],
                    });
                }}
            />
        </Box>
    );
});
