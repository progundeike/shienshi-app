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
import { AnswerInputs } from "./QuestionAndAnswerForm";
import { EditQuestionModal } from "./EditQuestionModal";
import { useAdmin } from "../../hooks/useAdmin";
import { LoadingPage } from "../pages/LoadingPage";

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
    const { handleSubmit, watch, reset, setValue, control, getValues } =
        useForm<AnswerInputs>();
    const qc = useQueryClient();

    // セッションストレージからデータを取得
    const STORAGE_KEY = `modelAnswerFormData-${year}-${season}-${section}`;
    const storedData = sessionStorage.getItem(STORAGE_KEY);

    // 入力が変更されたらsessionStorageに保存
    const answerValues = useWatch({
        control,
        name: "answer",
    });

    useEffect(() => {
        if (answerValues) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answerValues));
        }
    }, [answerValues]);

    // sessionStorageからデータを復元
    useEffect(() => {
        if (storedData) {
            console.log("sessionStorageからデータを復元");
            const parsedData = JSON.parse(storedData);
            reset({ answer: parsedData });
        }
    }, [setValue]);

    // 模範解答の取得、更新
    const { getModelAnswers, updateModelAnswers, getQuestionsForEdit } =
        useAdmin(year, season, section);
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
        updateModelAnswers.mutate(data, {
            // 成功したらフォームとセッションストレージをクリア
            onSuccess: () => {
                reset();
                sessionStorage.removeItem(STORAGE_KEY);
                console.log("sessionStorageをクリア");

                // ReactQueryのキャッシュを無効化して再取得
                qc.invalidateQueries({
                    queryKey: ["modelAnswers", year, season, section],
                });
            },
        });
    };

    // modelAnswersをフォーム初期値に反映(sessionStorageが無いときだけ)
    useEffect(() => {
        const modelAnswersData = modelAnswersQuery.data;
        console.log(modelAnswersData);
        if (modelAnswersData && !storedData) {
            const initialValues: AnswerInputs["answer"] = {};
            modelAnswersData.forEach((ma) => {
                initialValues[ma.questionCode] = ma.text;
            });
            reset({ answer: initialValues });
            console.log("modelAnswersをフォーム初期値に反映");
        }
    }, [modelAnswersQuery.data, reset, storedData]);

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
                                    <Box>
                                        <Text
                                            fontSize="md"
                                            whiteSpace="pre-line"
                                        >
                                            [text_for_ai: {question.textForAi}]
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
