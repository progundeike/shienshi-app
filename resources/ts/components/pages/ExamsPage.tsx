import {
    Box,
    Flex,
    Input,
    Text,
    VStack,
    RadioGroup,
    Radio,
    Stack,
    Button,
    Heading,
} from "@chakra-ui/react";
import { FC, memo, useEffect, useMemo, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useForm, SubmitHandler, useFieldArray, set } from "react-hook-form";
import { CountTextarea } from "../molecules/CountTextarea";
import { questionData } from "../../states/question";

type Inputs = {
    questions: {
        answer: string;
    }[];
};

export const ExamsPage: FC = memo(() => {
    const [numPages, setNumPages] = useState(1);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    };

    // Workerのパスを設定
    pdfjs.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs";

    const url = useMemo(() => "http://localhost:8080/storage/pdf/test.pdf", []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <>
            {/* ExamHeader */}
            <Box
                m="auto"
                w={{ base: "100%", md: "90%" }}
                maxW="1500px"
                p="5px"
                h="50px"
            >
                <Heading as="h2" size="md">
                    令和5年 秋 午後問1
                </Heading>
            </Box>
            <Flex>
                {/* PDF */}
                <Box flex="3">
                    <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                        {Array.from(new Array(numPages), (el, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                width={1000}
                            />
                        ))}
                    </Document>
                </Box>

                {/* 問、解答欄 */}
                <Box
                    flex="1"
                    position="sticky"
                    top="0"
                    padding="2"
                    height="100vh"
                    overflowY="auto"
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <VStack align="stretch">
                            {/* 設問をループ */}
                            {questionData.map((questionsList, index) => (
                                <>
                                    <Text key={questionsList.id + index}>
                                        設問{questionsList.id}
                                    </Text>

                                    {questionsList.questions.map(
                                        (question, index) => (
                                            <Box key={index}>
                                                {/* 質問文 */}
                                                <Text fontSize="md">
                                                    {question.text}
                                                </Text>

                                                {/* 解答欄 */}
                                                {question.type === "radio" ? (
                                                    <RadioGroup>
                                                        <Stack>
                                                            {question.options?.map(
                                                                (
                                                                    option,
                                                                    index
                                                                ) => (
                                                                    <Radio
                                                                        key={
                                                                            index
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                        {...register(
                                                                            `questions.${index}.answer`
                                                                        )}
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </Radio>
                                                                )
                                                            )}
                                                        </Stack>
                                                    </RadioGroup>
                                                ) : (
                                                    <>
                                                        <CountTextarea
                                                            maxLength={
                                                                question.maxLength
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Box>
                                        )
                                    )}
                                </>
                            ))}

                            {/* 提出ボタン */}
                            <Box textAlign="center" mt="20px">
                                <Button
                                    type="submit"
                                    backgroundColor="green.200"
                                >
                                    答え合わせ
                                </Button>
                            </Box>
                        </VStack>
                    </form>
                </Box>
            </Flex>
        </>
    );
});
