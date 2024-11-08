import {
    VStack,
    RadioGroup,
    Stack,
    Radio,
    Button,
    Box,
    Text,
    Textarea,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { FC, memo, useEffect, useState, Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAtom, useAtomValue } from "jotai";

import { userAtom } from "../../states/userAtom";
import { useAnswer } from "../../hooks/useAnswer";
import { FetchedQuestion, Option, useExam } from "../../hooks/useExam";
import { DisplayAIResponse } from "./DisplayAIResponse";
import { loadingAtom } from "../../states/loadingAtom";
import { NeedRegister } from "../molecules/NeedRegister";
import { DisplayAskToAICard } from "../molecules/DisplayAskToAICard";

export type AnswerInputs = {
    answer: {
        [id: string]: string;
    };
};

export type Correction = {
    questionNumber: number;
    subQuestionNumber: number;
    rating: string;
    comment: string;
    user_text: string;
};

export const testResponse = [
    {
        questionNumber: 1,
        subQuestionNumber: 1,
        rating: "◯",
        comment: "正解です。XSS脆弱性の種類は格納型 XSSです。",
        user_text: "イ",
    },
    {
        questionNumber: 1,
        subQuestionNumber: 2,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「レビュータイトルを出力する前にエスケープ処理を施す。」",
        user_text: "",
    },
    {
        questionNumber: 2,
        subQuestionNumber: 0,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「HTMLがコメントアウトされ一つのスクリプトになるような投稿を複数回に分けて行った。」",
        user_text: "",
    },
    {
        questionNumber: 3,
        subQuestionNumber: 1,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「XHRのレスポンスから取得したトークンとともに、アイコン画像としてセッションIDをアップロードする。」",
        user_text: "",
    },
    {
        questionNumber: 3,
        subQuestionNumber: 2,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「会員のアイコン画像をダウンロードして、そこからセッションIDの文字列を取り出す。」",
        user_text: "",
    },
    {
        questionNumber: 3,
        subQuestionNumber: 3,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「ページVにアクセスした会員になりすまして、WebアプリQの機能を使う。」",
        user_text: "",
    },
    {
        questionNumber: 4,
        subQuestionNumber: 0,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「スクリプトから別ドメインのURLに対してcookieが送られない仕組み」",
        user_text: "",
    },
];

type Props = {
    year: number;
    season: string;
    section: number;
};

export const QuestionAndAnswerForm: FC<Props> = memo((props) => {
    const { year, season, section } = props;
    const [questions, setQuestions] = useState<FetchedQuestion[] | null>(null);
    const [aiResponse, setCorrection] = useState<Correction[] | null>(null);
    const user = useAtomValue(userAtom);
    const [isLoading, setIsLoading] = useAtom(loadingAtom);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<AnswerInputs>();

    const { fetchQuestions } = useExam();
    const { submitAnswer, fetchCorrection, deleteSubmittedAnswer } =
        useAnswer();

    const onSubmit: SubmitHandler<AnswerInputs> = async (data) => {
        try {
            const response = await submitAnswer(
                data,
                questions![0].year,
                questions![0].season,
                questions![0].section
            );

            // const response = testResponse;

            if (response) {
                setCorrection(response);
            }
        } catch (e) {
            console.error(e);
        }

        return;
    };

    const onReset = () => {
        setCorrection(null);
        deleteSubmittedAnswer(year, season, section);
        reset();
    };

    useEffect(() => {
        console.log("render");
        if (!year || !season || !section) return;

        fetchQuestions(year, season, section).then((data) => {
            if (data) {
                setQuestions(data);
            }
        });

        // ログイン済みの場合は、提出済み答案と添削結果を取得
        if (user) {
            fetchCorrection(year, season, section).then((data) => {
                console.log(data);

                if (data) {
                    setCorrection(data);
                }
            });
        }
    }, [year, season, section, user]);

    if (isLoading) {
        return (
            <Center mt="20px">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!questions) {
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
                        答え合わせをするためにはログインが必要です。
                    </Text>
                </Box>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="stretch">
                    {/* 設問をループ */}
                    {questions &&
                        questions.map((question, index) => (
                            <Fragment key={index}>
                                {(question.subQuestionNumber == 1 ||
                                    question.subQuestionNumber == 0) && (
                                    <Text>設問{question.questionNumber}</Text>
                                )}

                                <Box>
                                    {/* 質問文 */}
                                    <Text fontSize="md" whiteSpace="pre-line">
                                        {question.text}
                                    </Text>

                                    {/* 解答欄 */}
                                    {question.type === "radio" ? (
                                        <RadioGroup>
                                            <Stack>
                                                {question.options &&
                                                    question.options.map(
                                                        (
                                                            option: Option,
                                                            index: number
                                                        ) => (
                                                            <Radio
                                                                key={index}
                                                                value={
                                                                    option.value
                                                                }
                                                                {...register(
                                                                    `answer.${question.questionNumber}-${question.subQuestionNumber}`
                                                                )}
                                                            >
                                                                {option.label}
                                                            </Radio>
                                                        )
                                                    )}
                                            </Stack>
                                        </RadioGroup>
                                    ) : (
                                        <>
                                            {!aiResponse && (
                                                <>
                                                    <Textarea
                                                        {...register(
                                                            `answer.${question.questionNumber}-${question.subQuestionNumber}`
                                                        )}
                                                        readOnly={
                                                            aiResponse
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    {question.maxLength && (
                                                        <Box textAlign="right">
                                                            (
                                                            {watch(
                                                                `answer.${question.questionNumber}-${question.subQuestionNumber}`,
                                                                ""
                                                            ).length || 0}
                                                            /
                                                            {question.maxLength}
                                                            字)
                                                        </Box>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </Box>

                                {/* 添削結果 */}
                                {aiResponse && (
                                    <>
                                        {/* <DisplayUserAnswer /> */}

                                        <DisplayAIResponse
                                            questionNumber={
                                                question.questionNumber
                                            }
                                            subQuestionNumber={
                                                question.subQuestionNumber
                                            }
                                            aiResponse={aiResponse}
                                        ></DisplayAIResponse>

                                        <DisplayAskToAICard
                                            questionNumber={
                                                question.questionNumber
                                            }
                                            subQuestionNumber={
                                                question.subQuestionNumber
                                            }
                                            year={question.year}
                                            season={question.season}
                                            section={question.section}
                                        />
                                    </>
                                )}
                            </Fragment>
                        ))}

                    <Box textAlign="center" mt="20px">
                        {/* ログイン前 */}
                        {!user && <NeedRegister />}

                        {/* ログイン後 提出 or リセットボタン */}
                        {user && (
                            <Box>
                                {aiResponse ? (
                                    <Button
                                        backgroundColor="green.200"
                                        borderRadius="100px"
                                        w="80%"
                                        onClick={onReset}
                                    >
                                        解き直す
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        backgroundColor="green.200"
                                        borderRadius="100px"
                                        w="80%"
                                    >
                                        答え合わせ
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Box>
                </VStack>
            </form>
        </>
    );
});
