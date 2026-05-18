import {
    VStack,
    Button,
    Box,
    Text,
    Textarea,
    Spinner,
    Center,
    Flex,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
} from "@chakra-ui/react";
import { FC, memo, Fragment } from "react";
import { useForm } from "react-hook-form";
import { useAtom } from "jotai";

import { useAnswer } from "../../hooks/useAnswer";
import { DisplayAIResponse } from "./DisplayAIResponse";
import { loadingAtom } from "../../states/loadingAtom";
import { DisplayAskToAICard } from "../molecules/DisplayAskToAICard";
import { Answer } from "../../types/form";
import { Correction } from "./QuestionAndAnswerInput";
import { FetchedQuestion, Option } from "../../types/exam";
import { DisplayPurposeAndReviewComment } from "../molecules/DisplayPurposeAndReviewComment";

type Props = {
    year: number;
    season: string;
    section: number;
    questions: FetchedQuestion[];
    corrections: Correction[];
    refetchCollections: () => void;
    purpose: string | null;
    reviewComment: string | null;
};

// 添削結果を表示するコンポーネント
export const DisplayCorrections: FC<Props> = memo((props) => {
    const {
        year,
        season,
        section,
        questions,
        corrections,
        refetchCollections,
        purpose,
        reviewComment,
    } = props;
    const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const STORAGE_KEY = `formData-${year}-${season}-${section}`;

    const {
        formState: { errors },
        reset,
    } = useForm<Answer[]>();

    const { deleteSubmittedAnswer } = useAnswer();

    const onReset = async () => {
        await deleteSubmittedAnswer(year, season, section);
        refetchCollections();
        reset();
        // sessionStorageをクリア
        sessionStorage.removeItem(STORAGE_KEY);
    };

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
            <Box mb="20px">
                <DisplayPurposeAndReviewComment
                    purpose={purpose}
                    reviewComment={reviewComment}
                />
            </Box>
            <form autoComplete="off">
                <VStack align="stretch">
                    {/* 設問をループ */}
                    {questions &&
                        questions.map((question, index) => (
                            <Fragment key={index}>
                                {question.subQuestionNumber == 1 &&
                                    question.smallQuestionNumber < 2 && (
                                        <Text>
                                            設問{question.questionNumber}
                                        </Text>
                                    )}

                                <Box>
                                    {/* 質問文 */}
                                    <Text fontSize="md" whiteSpace="pre-line">
                                        {question.text}
                                    </Text>

                                    {/* 解答欄 */}
                                    {/* ラジオボタン */}
                                    {question.type === "radio" && (
                                        <RadioGroup>
                                            <Flex
                                                wrap="wrap"
                                                gap="20px"
                                                my="10px"
                                            >
                                                {question.options!.map(
                                                    (
                                                        option: Option,
                                                        index: number,
                                                    ) => (
                                                        <Radio
                                                            isReadOnly
                                                            disabled
                                                            key={index}
                                                            value={option.value}
                                                            style={{
                                                                pointerEvents:
                                                                    "none",
                                                                cursor: "default",
                                                            }}
                                                        >
                                                            <Flex
                                                                gap="10px"
                                                                alignItems="center"
                                                            >
                                                                <Box>
                                                                    {
                                                                        option.label
                                                                    }
                                                                </Box>
                                                            </Flex>
                                                        </Radio>
                                                    ),
                                                )}
                                            </Flex>
                                        </RadioGroup>
                                    )}

                                    {/* チェックボックス */}
                                    {question.type === "checkbox" && (
                                        <Box>
                                            <CheckboxGroup>
                                                <Flex wrap="wrap" gap="20px">
                                                    {question.options!.map(
                                                        (
                                                            option: Option,
                                                            index: number,
                                                        ) => (
                                                            <Checkbox
                                                                isReadOnly
                                                                key={index}
                                                                value={
                                                                    option.value
                                                                }
                                                                style={{
                                                                    pointerEvents:
                                                                        "none",
                                                                    cursor: "default",
                                                                }}
                                                            >
                                                                <Flex
                                                                    gap="10px"
                                                                    alignItems="center"
                                                                >
                                                                    <Box>
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </Box>
                                                                </Flex>
                                                            </Checkbox>
                                                        ),
                                                    )}
                                                </Flex>
                                            </CheckboxGroup>
                                        </Box>
                                    )}

                                    {/* オプションのラベルを表示 */}
                                    {question.type !== "radio" &&
                                        question.type !== "checkbox" && (
                                            <Box>
                                                {question.options?.map(
                                                    (option, index) => (
                                                        <Box key={index}>
                                                            {option.label}
                                                        </Box>
                                                    ),
                                                )}
                                            </Box>
                                        )}
                                </Box>

                                <DisplayAIResponse
                                    questionNumber={question.questionNumber}
                                    subQuestionNumber={
                                        question.subQuestionNumber
                                    }
                                    smallQuestionNumber={
                                        question.smallQuestionNumber
                                    }
                                    corrections={corrections}
                                />

                                <DisplayAskToAICard
                                    examCode={question.examCode}
                                    questionCode={`${question.questionNumber}_${question.subQuestionNumber}_${question.smallQuestionNumber}`}
                                />
                            </Fragment>
                        ))}

                    <Box textAlign="center" mt="20px">
                        <Box>
                            <Button
                                backgroundColor="green.200"
                                borderRadius="100px"
                                w="100%"
                                onClick={onReset}
                            >
                                解き直す
                            </Button>
                        </Box>
                    </Box>
                </VStack>
            </form>
        </>
    );
});
