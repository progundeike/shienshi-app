import {
    VStack,
    Button,
    Box,
    Text,
    Spinner,
    Center,
    Divider,
} from "@chakra-ui/react";
import {
    FC,
    memo,
    useEffect,
    useState,
    Fragment,
    useMemo,
    useCallback,
} from "react";
import { set, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useAtom, useAtomValue } from "jotai";

import { userAtom } from "../../states/userAtom";
import { useAnswer } from "../../hooks/useAnswer";
import { FetchedQuestion } from "../../hooks/useExam";
import { loadingAtom } from "../../states/loadingAtom";
import { NeedRegister } from "../molecules/NeedRegister";
import { RadioQuestionForm } from "../molecules/RadioQuestionForm";
import { CheckboxQuestionForm } from "../molecules/CheckboxQuestionForm";
import { InputQuestionForm } from "../molecules/InputQuestionForm";
import { TextareaQuestionForm } from "../molecules/TextareaQuestionForm";
import { Answer } from "../../types/form";
import { CorrectionLoadingSpinner } from "../molecules/CorrectionLoadingSpinner";

export type Correction = {
    questionNumber: number;
    subQuestionNumber: number;
    aiRating: string;
    aiText: string;
    userText: string;
};

type Props = {
    year: number;
    season: string;
    section: number;
    questions: FetchedQuestion[];
    refetchCorrections: () => void;
};

export const QuestionAndAnswerForm: FC<Props> = memo((props) => {
    const { year, season, section, questions, refetchCorrections } = props;
    const user = useAtomValue(userAtom);
    const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const [isCorrecting, setIsCorrecting] = useState(false);
    const STORAGE_KEY = `formData-${year}-${season}-${section}`;
    const storedData = sessionStorage.getItem(STORAGE_KEY);

    const initialAnswers = useMemo(
        () =>
            questions.map((q) => ({
                questionCode: `${q.questionNumber}_${q.subQuestionNumber}_${q.smallQuestionNumber}`,
                content: q.type === "checkbox" ? [] : "",
            })),
        [questions],
    );

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<{ answers: Answer[] }>({
        defaultValues: {
            answers: storedData ? JSON.parse(storedData) : initialAnswers,
        },
    });

    const { submitAnswer, checkAnswerProcessingStatus } = useAnswer();

    const checkProcessingStatus = useCallback(async (): Promise<boolean> => {
        try {
            const status = await checkAnswerProcessingStatus(
                year,
                season,
                section,
            );

            if (status === "processing") {
                setIsCorrecting(true);
                return true;
            }

            setIsCorrecting(false);
            return false;
        } catch (error) {
            console.error(error);
            setIsCorrecting(false);
            return false;
        }
    }, [checkAnswerProcessingStatus, year, season, section]);

    // 初回のprocessing状態の確認とポーリング
    useEffect(() => {
        if (!user) {
            return;
        }

        let intervalId: number | null = null;
        let cancelled = false;

        const startPolling = async () => {
            const isProcessing = await checkProcessingStatus();

            if (cancelled || !isProcessing) {
                return;
            }

            intervalId = window.setInterval(async () => {
                const stillProcessing = await checkProcessingStatus();

                if (!stillProcessing && intervalId) {
                    window.clearInterval(intervalId);
                    intervalId = null;
                    refetchCorrections();
                }
            }, 5000);
        };

        void startPolling();

        return () => {
            cancelled = true;
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [year, season, section, user, refetchCorrections]);

    // 入力が変更されたらsessionStorageに保存
    const answersWatch = useWatch({
        control,
        name: "answers",
    });

    useEffect(() => {
        if (answersWatch) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answersWatch));
        }
    }, [answersWatch]);

    // sessionStorageからデータを復元
    useEffect(() => {
        if (storedData) {
            reset({ answers: JSON.parse(storedData) });
        }
    }, [reset]);

    const onSubmit: SubmitHandler<{ answers: Answer[] }> = async (data) => {
        setIsCorrecting(true);
        try {
            await submitAnswer(data.answers, year, season, section);
            refetchCorrections();
        } catch (e) {
            console.error(e);
        } finally {
            setIsCorrecting(false);
        }
    };

    if (isLoading && !isCorrecting) {
        return (
            <Center mt="20px">
                <Spinner size="xl" />
            </Center>
        );
    }

    // 添削中に表示するメッセージ
    if (isCorrecting) {
        return <CorrectionLoadingSpinner />;
    }

    if (!isLoading && !questions) {
        return (
            <Box>
                設問が取得できませんでした。しばらく経ってから再度お試しください
            </Box>
        );
    }

    return (
        <>
            {!user && (
                <Box textAlign="center" m="10px">
                    <Text color="red" fontWeight="bold">
                        答え合わせをするためにはログインが必要です
                    </Text>
                </Box>
            )}

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
                            </Fragment>
                        ))}

                    <Box textAlign="center" mt="20px">
                        {user ? (
                            <Button
                                type="submit"
                                backgroundColor="green.200"
                                borderRadius="100px"
                                w="80%"
                            >
                                答え合わせ
                            </Button>
                        ) : (
                            <NeedRegister />
                        )}
                    </Box>
                </VStack>
            </form>
        </>
    );
});
