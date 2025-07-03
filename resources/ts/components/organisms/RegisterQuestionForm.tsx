import {
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    Input,
    InputGroup,
    InputLeftAddon,
    Radio,
    RadioGroup,
    Textarea,
    VStack,
    Text,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import { FC, Fragment, memo, useEffect, useState } from "react";

import {
    Controller,
    SubmitHandler,
    useFieldArray,
    useForm,
} from "react-hook-form";
import { FetchedQuestion, useExam } from "../../hooks/useExam";
import { CheckboxQuestionForm } from "../molecules/CheckboxQuestionForm";
import { InputQuestionForm } from "../molecules/InputQuestionForm";
import { NeedRegister } from "../molecules/NeedRegister";
import { RadioQuestionForm } from "../molecules/RadioQuestionForm";
import { TextareaQuestionForm } from "../molecules/TextareaQuestionForm";
import { AnswerInputs } from "./QuestionAndAnswerForm";
import { AiOutlineFieldString } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { Page404 } from "../pages/Page404";
import { MainColorButton } from "../atoms/MainColorButton";
import { EditQuestionModal } from "./EditQuestionModal";

type Props = {
    year: number;
    season: string;
    section: number;
};

// type QuestionFormInputs = {
//     question_number: number;
//     sub_question_number: number;
//     small_question_number?: number;
//     text: string;
//     type: "radio" | "checkbox" | "input" | "textarea";
//     options?: {
//         label: string;
//         value: string;
//     }[];
//     max_length?: number;
// };

export const RegisterQuestionForm: FC<Props> = memo((props) => {
    const { year, season, section } = props;
    const { fetchQuestions } = useExam();
    const [questions, setQuestions] = useState<FetchedQuestion[] | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editTargetQuestion, setEditTargetQuestion] =
        useState<FetchedQuestion | null>(null);

    // 模範解答用フォーム
    const { register, handleSubmit, watch, reset } = useForm<AnswerInputs>();

    // 模範解答提出ハンドラー
    const onModelAnswerSubmit: SubmitHandler<AnswerInputs> = async (data) => {
        try {
            // 模範解答の提出に使用する
            console.log("Model answer submitted:", data);
        } catch (e) {
            console.error(e);
        }

        return;
    };

    useEffect(() => {
        const fetch = async () => {
            const data = await fetchQuestions(year, season, section);
            if (data) {
                setQuestions(data);
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
                                            register={register}
                                            watch={watch}
                                        />
                                    )}

                                    {question.type === "checkbox" && (
                                        <CheckboxQuestionForm
                                            question={question}
                                            register={register}
                                            watch={watch}
                                        />
                                    )}

                                    {question.type === "textarea" && (
                                        <TextareaQuestionForm
                                            question={question}
                                            register={register}
                                            watch={watch}
                                        />
                                    )}

                                    {question.type === "input" && (
                                        <InputQuestionForm
                                            question={question}
                                            register={register}
                                            watch={watch}
                                        />
                                    )}
                                </Box>

                                <Box w="100%" textAlign="right" mb="10px">
                                    <Button
                                        colorScheme="green"
                                        borderRadius="full"
                                        onClick={() => {
                                            setEditTargetQuestion(question);
                                            onOpen(); // 問題編集モーダルを開く
                                        }}
                                    >
                                        編集
                                    </Button>
                                </Box>
                            </Fragment>
                        ))}
                </VStack>
            </form>

            <Divider my="10px" />

            {/* 問題を追加するためのフォーム */}
            <Box w="80%" mx="auto" my="20px">
                <Button
                    w="100%"
                    onClick={onOpen}
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
            />
        </Box>
    );
});
