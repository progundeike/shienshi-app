import {
    VStack,
    RadioGroup,
    Stack,
    Radio,
    Button,
    Box,
    Text,
    Textarea,
    Flex,
    HStack,
    Center,
} from "@chakra-ui/react";
import { FC, memo, useEffect, useState, Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useAnswer } from "../../hooks/useAnswer";
import { FetchedQuestion, Option, useExam } from "../../hooks/useExam";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import { Link } from "react-router-dom";
import { DisplayAiResponse } from "./DisplayAiResponse";
import { AskToAiArea } from "./AskToAiArea";

export type AnswerInputs = {
    answer: {
        [id: string]: string;
    };
};

export type AiResponse = {
    questionId: number;
    subQuestionId: number;
    rating: string;
    comment: string;
};

const testResponse = [
    {
        questionId: 1,
        subQuestionId: 1,
        rating: "◯",
        comment: "正解です。XSS脆弱性の種類は格納型 XSSです。",
    },
    {
        questionId: 1,
        subQuestionId: 2,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「レビュータイトルを出力する前にエスケープ処理を施す。」",
    },
    {
        questionId: 2,
        subQuestionId: 0,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「HTMLがコメントアウトされ一つのスクリプトになるような投稿を複数回に分けて行った。」",
    },
    {
        questionId: 3,
        subQuestionId: 1,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「XHRのレスポンスから取得したトークンとともに、アイコン画像としてセッションIDをアップロードする。」",
    },
    {
        questionId: 3,
        subQuestionId: 2,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「会員のアイコン画像をダウンロードして、そこからセッションIDの文字列を取り出す。」",
    },
    {
        questionId: 3,
        subQuestionId: 3,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「ページVにアクセスした会員になりすまして、WebアプリQの機能を使う。」",
    },
    {
        questionId: 4,
        subQuestionId: 0,
        rating: "×",
        comment:
            "未回答のため、模範解答を提示します。「スクリプトから別ドメインのURLに対してcookieが送られない仕組み」",
    },
];

export const QuestionAndAnswerForm: FC = memo(() => {
    const [questions, setQuestions] = useState<FetchedQuestion[] | null>(null);
    const [aiResponse, setAiResponse] = useState<AiResponse[] | null>(null);
    const user = useRecoilValue(userAtom);
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<AnswerInputs>();
    const { fetchQuestions } = useExam();
    const { submitAnswer } = useAnswer();

    const onSubmit: SubmitHandler<AnswerInputs> = async (data) => {
        try {
            const response = await submitAnswer(
                data,
                questions![0].examYear,
                questions![0].examSeason
            );

            // const response = testResponse;
            if (response) {
                setAiResponse(response);
            }
        } catch (e) {
            console.error(e);
        }

        return;
    };

    useEffect(() => {
        fetchQuestions(2023, "aki", 1).then((data) => {
            if (data) {
                setQuestions(data);
            }
        });
    }, []);

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
                                {(question.subQuestionId == 1 ||
                                    question.subQuestionId == 0) && (
                                    <Text>設問{question.questionId}</Text>
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
                                                                    `answer.${question.questionId}-${question.subQuestionId}`
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
                                            <Textarea
                                                {...register(
                                                    `answer.${question.questionId}-${question.subQuestionId}`
                                                )}
                                            />
                                            {question.maxLength && (
                                                <Box textAlign="right">
                                                    (
                                                    {watch(
                                                        `answer.${question.questionId}-${question.subQuestionId}`,
                                                        ""
                                                    ).length || 0}
                                                    /{question.maxLength}字)
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </Box>

                                {/* 添削結果 */}
                                {aiResponse && (
                                    <>
                                        <DisplayAiResponse
                                            questionId={question.questionId}
                                            subQuestionId={
                                                question.subQuestionId
                                            }
                                            aiResponse={aiResponse}
                                        ></DisplayAiResponse>

                                        <AskToAiArea
                                            questionId={question.questionId}
                                            subQuestionId={
                                                question.subQuestionId
                                            }
                                        />
                                    </>
                                )}
                            </Fragment>
                        ))}

                    {/* 提出ボタン */}
                    <Box textAlign="center" mt="20px">
                        {user ? (
                            <Button type="submit" backgroundColor="green.200">
                                答え合わせ
                            </Button>
                        ) : (
                            <>
                                <Box mb="10px">
                                    <Text>
                                        答え合わせにはログインが必要です
                                    </Text>
                                </Box>
                                <Flex justifyContent="center" gap="20px">
                                    <Link to="/login">
                                        <Button backgroundColor="green.200">
                                            ログイン
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button backgroundColor="blue.200">
                                            ユーザー登録
                                        </Button>
                                    </Link>
                                </Flex>
                            </>
                        )}
                    </Box>
                </VStack>
            </form>
        </>
    );
});
