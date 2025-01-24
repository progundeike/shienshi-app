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
import { FC, memo, useEffect, useState, Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAtom, useAtomValue } from "jotai";

import { useAnswer } from "../../hooks/useAnswer";
import { FetchedQuestion, Option, useExam } from "../../hooks/useExam";
import { DisplayAIResponse } from "./DisplayAIResponse";
import { loadingAtom } from "../../states/loadingAtom";
import { DisplayAskToAICard } from "../molecules/DisplayAskToAICard";
import { RadioQuestionForm } from "../molecules/RadioQuestionForm";
import { AnswerInputs, Correction } from "./QuestionAndAnswerForm";
import { User } from "../../types/user";
import { LuBookX } from "react-icons/lu";

type Props = {
    year: number;
    season: string;
    section: number;
    questions: FetchedQuestion[];
    corrections: Correction[];
    setCorrections: (corrections: Correction[] | null) => void;
    user: User;
};

// 添削結果を表示するコンポーネント
export const CheckingAnswerArea: FC<Props> = memo((props) => {
    const { year, season, section, questions, corrections, setCorrections } =
        props;
    const [isLoading, setIsLoading] = useAtom(loadingAtom);

    const {
        register,
        formState: { errors },
        reset,
    } = useForm<AnswerInputs>();

    const { deleteSubmittedAnswer } = useAnswer();

    const onReset = () => {
        deleteSubmittedAnswer(year, season, section);
        setCorrections(null);
        reset();
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
                                                        index: number
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
                                                    )
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
                                                            index: number
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
                                                        )
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
                                                    )
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
                                    questionNumber={question.questionNumber}
                                    subQuestionNumber={
                                        question.subQuestionNumber
                                    }
                                    year={question.year}
                                    season={question.season}
                                    section={question.section}
                                />
                            </Fragment>
                        ))}

                    <Box textAlign="center" mt="20px">
                        <Box>
                            <Button
                                backgroundColor="green.200"
                                borderRadius="100px"
                                w="80%"
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
