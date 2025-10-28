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
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { FetchedQuestion, QuestionForEdit, useExam } from "../../hooks/useExam";
import { CheckboxQuestionForm } from "../molecules/CheckboxQuestionForm";
import { InputQuestionForm } from "../molecules/InputQuestionForm";
import { RadioQuestionForm } from "../molecules/RadioQuestionForm";
import { TextareaQuestionForm } from "../molecules/TextareaQuestionForm";
import { EditQuestionModal } from "./EditQuestionModal";
import { useAdmin } from "../../hooks/useAdmin";
import { LoadingPage } from "../pages/LoadingPage";
import { AnswerInputs } from "../../types/form";

type Props = {
    year: number;
    season: string;
    section: number;
};

export const RegisterQuestionForm: FC<Props> = memo((props) => {
    const { year, season, section } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editTargetQuestion, setEditTargetQuestion] =
        useState<QuestionForEdit | null>(null);
    const { handleSubmit, reset, control } = useForm<AnswerInputs>({
        defaultValues: { answer: { text: {}, checkbox: {} } },
    });
    const qc = useQueryClient();

    // 模範解答の取得、更新
    const { getModelAnswers, updateModelAnswers, getQuestionsForEdit } =
        useAdmin();
    const questionsQuery = useQuery({
        queryKey: ["questions", year, season, section],
        queryFn: () => getQuestionsForEdit(year, season, section),
    });
    const modelAnswersQuery = useQuery({
        queryKey: ["modelAnswers", year, season, section],
        queryFn: () => getModelAnswers(year, season, section),
    });

    // 模範解答提出ハンドラー
    const onModelAnswerSubmit: SubmitHandler<AnswerInputs> = async (data) => {
        // フラット化 + 正規化(配列→文字列, 未入力→空文字)
        const normalized: Record<string, string> = {};
        Object.entries(data.answer.text).forEach(([key, value]) => {
            normalized[key] = (value ?? "").toString().trim();
        });
        Object.entries(data.answer.checkbox).forEach(([key, value]) => {
            normalized[key] = Array.isArray(value)
                ? value.length
                    ? value.join(",")
                    : ""
                : "";
        });

        updateModelAnswers.mutate(
            { year, season, section, modelAnswers: normalized } as any,
            {
                onSuccess: () => {
                    reset(); // フォームをクリア

                    // ReactQueryのキャッシュを無効化して再取得
                    qc.invalidateQueries({
                        queryKey: ["modelAnswers", year, season, section],
                    });
                },
            }
        );
    };

    // modelAnswersをフォーム初期値に反映
    useEffect(() => {
        const questionsData = questionsQuery.data;
        if (!questionsData) return;
        const modelAnswersData = modelAnswersQuery.data ?? [];
        const byCode = new Map(
            modelAnswersData.map((ma) => [ma.questionCode, ma.text])
        );
        const initialValues: AnswerInputs["answer"] = {
            text: {},
            checkbox: {},
        };

        questionsData.forEach((q) => {
            const code = `${q.questionNumber}_${q.subQuestionNumber}_${q.smallQuestionNumber}`;
            const answerText = byCode.get(code) ?? "";
            if (
                q.type === "textarea" ||
                q.type === "input" ||
                q.type === "radio"
            ) {
                initialValues.text[code] = answerText;
            } else if (q.type === "checkbox") {
                initialValues.checkbox[code] = answerText
                    ? answerText.split(",")
                    : [];
            }
        });
        reset({ answer: initialValues });
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
                                        />
                                    )}

                                    {question.type === "checkbox" && (
                                        <CheckboxQuestionForm
                                            question={question}
                                            control={control}
                                        />
                                    )}

                                    {question.type === "textarea" && (
                                        <TextareaQuestionForm
                                            question={question}
                                            control={control}
                                        />
                                    )}

                                    {question.type === "input" && (
                                        <InputQuestionForm
                                            question={question}
                                            control={control}
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
                year={year}
                season={season}
                section={section}
                isOpen={isOpen}
                onClose={onClose}
                question={editTargetQuestion}
                onSuccess={async () => {
                    // 問題が追加された後に再度問題を取得
                    qc.invalidateQueries({
                        queryKey: ["questions", year, season, section],
                    });
                }}
            />
        </Box>
    );
});
