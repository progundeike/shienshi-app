import {
    VStack,
    Button,
    Box,
    Text,
    Textarea,
    Spinner,
    Center,
    Input,
    Flex,
} from "@chakra-ui/react";
import { FC, memo, useEffect, useState, Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAtom, useAtomValue } from "jotai";

import { userAtom } from "../../states/userAtom";
import { useAnswer } from "../../hooks/useAnswer";
import { FetchedQuestion, Option, useExam } from "../../hooks/useExam";
import { loadingAtom } from "../../states/loadingAtom";
import { NeedRegister } from "../molecules/NeedRegister";
import { RadioQuestionForm } from "../molecules/RadioQuestionForm";

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
    questions: FetchedQuestion[];
    setCorrections: (corrections: Correction[] | null) => void;
};

export const QuestionAndAnswerForm: FC<Props> = memo((props) => {
    const { year, season, section, questions, setCorrections } = props;

    // const [corrections, setCorrection] = useState<Correction[] | null>(null);

    const user = useAtomValue(userAtom);
    const [isLoading, setIsLoading] = useAtom(loadingAtom);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<AnswerInputs>();

    const { submitAnswer } = useAnswer();

    const onSubmit: SubmitHandler<AnswerInputs> = async (data) => {
        try {
            const response = await submitAnswer(data, year, season, section);

            // const response = testResponse;

            if (response) {
                setCorrections(response);
            }
        } catch (e) {
            console.error(e);
        }

        return;
    };

    if (isLoading) {
        return (
            <Center mt="20px">
                <Spinner size="xl" />
            </Center>
        );
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

                                <Box mb="5px">
                                    {/* 質問文 */}
                                    <Text fontSize="md" whiteSpace="pre-line">
                                        {question.text}
                                    </Text>

                                    {/* 解答欄 */}
                                    {question.type === "radio" && (
                                        <RadioQuestionForm
                                            question={question}
                                            register={register}
                                        />
                                    )}

                                    {question.type === "textarea" && (
                                        <Box>
                                            <Flex
                                                alignItems="center"
                                                gap="10px"
                                            >
                                                {/* 解答欄の左に表示する記号 [a]等 */}
                                                {question.options && (
                                                    <>
                                                        <Box>
                                                            {
                                                                question
                                                                    .options[0]
                                                                    .label
                                                            }
                                                        </Box>
                                                    </>
                                                )}
                                                <Textarea
                                                    {...register(
                                                        `answer.${question.questionNumber}-${question.subQuestionNumber}`
                                                    )}
                                                />
                                            </Flex>

                                            {question.maxLength && (
                                                <Box textAlign="right">
                                                    (
                                                    {watch(
                                                        `answer.${question.questionNumber}-${question.subQuestionNumber}`,
                                                        ""
                                                    ).length || 0}
                                                    /{question.maxLength}
                                                    字)
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    {question.type === "input" && (
                                        <Box>
                                            <Flex
                                                alignItems="center"
                                                gap="10px"
                                            >
                                                {/* 解答欄の左に表示する記号 [a]等 */}
                                                <Box>
                                                    {question.options &&
                                                        question.options[0]
                                                            .label}
                                                </Box>
                                                <Input
                                                    {...register(
                                                        `answer.${question.questionNumber}-${question.subQuestionNumber}`
                                                    )}
                                                />
                                            </Flex>
                                            {question.maxLength && (
                                                <Box textAlign="right">
                                                    (
                                                    {watch(
                                                        `answer.${question.questionNumber}-${question.subQuestionNumber}`,
                                                        ""
                                                    ).length || 0}
                                                    /{question.maxLength}
                                                    字)
                                                </Box>
                                            )}
                                        </Box>
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
