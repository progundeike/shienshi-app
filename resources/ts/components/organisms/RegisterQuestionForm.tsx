import {
    Box,
    Button,
    Divider,
    VStack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { FC, Fragment, memo, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

import { FetchedQuestion, useExam } from "../../hooks/useExam";
import { CheckboxQuestionForm } from "../molecules/CheckboxQuestionForm";
import { InputQuestionForm } from "../molecules/InputQuestionForm";
import { RadioQuestionForm } from "../molecules/RadioQuestionForm";
import { TextareaQuestionForm } from "../molecules/TextareaQuestionForm";
import { AnswerInputs } from "./QuestionAndAnswerForm";
import { EditQuestionModal } from "./EditQuestionModal";
import { ModelAnswer } from "../../types/form";
import { useAdmin } from "../../hooks/useAdmin";
import { ModelAnswerForm } from "./ModelAnswerForm";

type Props = {
    year: number;
    season: string;
    section: number;
};

export const RegisterQuestionForm: FC<Props> = memo((props) => {
    const { year, season, section } = props;
    const { fetchQuestions } = useExam();
    const [questions, setQuestions] = useState<FetchedQuestion[] | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editTargetQuestion, setEditTargetQuestion] =
        useState<FetchedQuestion | null>(null);
    const { handleSubmit, watch, reset, setValue, control, getValues } =
        useForm<AnswerInputs>();

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
            const parsedData = JSON.parse(storedData);
            reset({ answer: parsedData });
        }
    }, [setValue]);

    // 模範解答を取得する
    const [modelAnswers, setModelAnswers] = useState<ModelAnswer[]>([]);
    const { getModelAnswers, updateModelAnswers } = useAdmin(
        year,
        season,
        section
    );

    // 模範解答提出ハンドラー
    const onModelAnswerSubmit: SubmitHandler<AnswerInputs> = async (data) => {
        updateModelAnswers.mutate(data, {
            // 成功したらフォームとセッションストレージをクリア
            onSuccess: () => {
                reset();
                sessionStorage.removeItem(STORAGE_KEY);

                // 再度模範解答を取得
            },
        });
    };

    useEffect(() => {
        const fetch = async () => {
            const data = await fetchQuestions(year, season, section);
            if (data) {
                setQuestions(data);
            }

            const modelAnswersData = await getModelAnswers(
                year,
                season,
                section
            );
            if (modelAnswersData) {
                setModelAnswers(modelAnswersData);

                // 取得したmodelAnswerをフォーム初期値に反映
                const initialValues: AnswerInputs["answer"] = {};
                modelAnswersData.forEach((ma) => {
                    initialValues[ma.questionCode] = ma.text;
                });
                reset({ answer: initialValues });
            }
        };
        fetch();
    }, [year, season, section]);

    return (
        <Box>
            {/* 問題が登録されていれば、問題を表示 */}
            <form
                autoComplete="off"
                onSubmit={handleSubmit(onModelAnswerSubmit)}
            >
                <VStack align="stretch">
                    {/* 設問をループ */}
                    {questions &&
                        questions.map((question, index) => (
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

                                {/* <ModelAnswerForm
                                    modelAnswer={modelAnswers.find(
                                        (ma) =>
                                            ma.questionCode ===
                                            `${question.questionNumber}_${question.subQuestionNumber}_${question.smallQuestionNumber}`
                                    )}
                                    questionCode={`${question.questionNumber}_${question.subQuestionNumber}_${question.smallQuestionNumber}`}
                                    control={control}
                                /> */}
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
                    console.log("Question added or edited successfully.");
                    const data = await fetchQuestions(year, season, section);
                    setQuestions(data);
                }}
            />
        </Box>
    );
});
