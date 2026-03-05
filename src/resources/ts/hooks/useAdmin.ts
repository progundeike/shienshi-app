import axios from "axios";
import { axiosInstance } from "./axiosInstance";
import { useChakraToast } from "../utils/toastUtils";
import { QuestionForEdit, UpdateQuestionInputs } from "./useExam";
import { Answer, ErrorResponse, ModelAnswer } from "../types/form";
import { useMutation } from "@tanstack/react-query";

export type ExamSentenceResponse = {
    sentence: string;
    purpose: string;
    reviewComment: string;
}

export const useAdmin = () => {
    // const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const { unexpectedServerErrorToast, toast } = useChakraToast();

    // examSentenceを取得
    const getExamSentence = async (
        year: number,
        season: string,
        section: number
    ): Promise<ExamSentenceResponse | null> => {
        try {
            const response = await axiosInstance.get<ExamSentenceResponse>(
                `/api/admin/sentence/${year}-${season}-${section}`
            );

            return response.data;
        } catch (error) {
            console.error("examSentenceの取得に失敗しました", error);
            if (axios.isAxiosError(error) && error.response) {
                // サーバーからのエラーメッセージを表示
                toast({
                    title: "examSentenceの取得エラー",
                    description: error.response.data,
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
                return null;
            } else {
                toast(unexpectedServerErrorToast);
                console.error(error);
                return null;
            }
        }
    };

    // examSentenceの更新
    const updateExamSentence = async (
        year: number,
        season: string,
        section: number,
        sentence: string|null,
        purpose: string|null,
        reviewComment: string|null,
    ): Promise<void> => {
        // setIsLoading(true);
        try {
            const response = await axiosInstance.put(
                '/api/admin/sentence',
                { year, season, section, sentence, purpose, reviewComment }
            );
            if (response.status === 200) {
                toast({
                    title: "examSentenceの更新に成功しました",
                    status: "success",
                    duration: 6000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("問題文の更新に失敗しました", error);
            if (axios.isAxiosError(error) && error.response) {
                // サーバーからのエラーメッセージを表示
                toast({
                    title: "問題文の更新エラー",
                    description: error.response.data,
                    status: "error",

                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
            } else {
                toast(unexpectedServerErrorToast);
                console.error(error);
            }
        }
    };

    const updateExamQuestion = async (
        data: UpdateQuestionInputs
    ) => {
        return await axiosInstance
            .post<ErrorResponse | string | null>("/api/admin/question", data)
            .then((response) => {
                if (response.status !== 201) {
                    console.log(response.status);
                    toast({
                        title: "問題の更新に失敗しました",
                        description: "サーバーからの応答が不正です",
                        status: "error",
                        duration: 6000,
                        isClosable: true,
                        position: "bottom-right",
                    });
                }
                return response;
            })
            .catch((error) => {
                if (error.status === 422) {
                    // バリデーションエラー
                    return error;
                } else {
                    toast(unexpectedServerErrorToast);
                    return null;
                }
            })
    };

    const uploadPdf = async (
        year: number,
        season: string,
        section: number,
        file: File
    ): Promise<void> => {
        try {
            if (!file || file.type !== "application/pdf") {
                toast({
                    title: "PDFファイルを選択してください",
                    status: "warning",
                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
                return;
            }

            const formData = new FormData();
            formData.append("year", String(year));
            formData.append("season", season);
            formData.append("section", String(section));
            formData.append("file", file)

            const response = await axiosInstance.post(
                "/api/admin/upload-pdf",
                formData
            );

            if (response.status === 201) {
                toast({
                    title: "PDFが正常にアップロードされました",
                    status: "success",
                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
            } else {
                toast({
                    title: "PDFのアップロードに失敗しました",
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
            }
        } catch (error) {
            console.error("PDFのアップロードに失敗しました", error);
            toast(unexpectedServerErrorToast);
        }
    };

    const deletePdf = async (year: number, season: string, section: number) => {
        try {
            const response =  await axiosInstance.delete(`/api/admin/delete-pdf/${year}-${season}-${section}`);

            if (response.status !== 200) {
                toast({
                    title: "PDFの削除に失敗しました",
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
            }
        } catch (error) {
            console.error("PDFの削除に失敗しました", error);
            toast(unexpectedServerErrorToast);
        }
    }
    

    const getModelAnswers = async (
        examCode: string
    ): Promise<ModelAnswer[] | null> => {
        return  await axiosInstance.get<ModelAnswer[] | null>(
            `/api/admin/model-answers/${examCode}`
        )
            .then((response) => {
                if (response.status === 200) {
                    return response.data;
                }
                console.log(response)
                return null;
            }
            )
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    toast({
                        title: "模範解答が見つかりません",
                        description: "指定された試験の模範解答が存在しません。",
                        status: "error",
                        duration: 6000,
                        isClosable: true,
                        position: "bottom-right",
                    });
                    return null;
                }

                if (error.response && error.response.status === 401) {
                    // 再ログインの処理が他で走る
                    return null;
                }

                toast(unexpectedServerErrorToast);
                console.error(error);
                return null;
            }
        );  
    }

    type UpdateModelAnswerParams = {
        modelAnswers: {answers: Answer[]};
        examCode: string;
    }

    const updateModelAnswers = useMutation<void, Error, UpdateModelAnswerParams>({
        mutationFn: async ({examCode, modelAnswers}) => {
            await axiosInstance.post(
                `/api/admin/model-answers/${examCode}`,
                {modelAnswers}
            );
        },
        onSuccess: () => {
            toast({
                title: "模範解答の更新に成功しました",
                status: "success",
                duration: 6000,
                isClosable: true,
            });
        },
        onError: () => toast(unexpectedServerErrorToast),
    });

    type DeleteQuestionIdParams = {
        questionCode: string;
        examCode: string;
    }

    const deleteQuestion = useMutation<void, Error, DeleteQuestionIdParams>({
        mutationFn: async ({examCode, questionCode}) => {
            await axiosInstance.delete(`/api/admin/question/${examCode}/${questionCode}`);
        },
        onSuccess: () => {
            toast({
                title: "問題の削除に成功しました",
                status: "success",
                duration: 6000,
                isClosable: true,
            });
        },
        onError: () => toast(unexpectedServerErrorToast),
    });

    const getQuestionsForEdit = async (
        examCode: string
    ): Promise<QuestionForEdit[] | null> => {
        return await axiosInstance
            .get(`/api/admin/questions/${examCode}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    toast({
                        title: "設問が見つかりません",
                        description: "指定された試験の設問が存在しません。",
                        status: "error",
                        duration: 6000,
                        isClosable: true,
                        position: "bottom-right",
                    });
                    return null;
                }

                toast(unexpectedServerErrorToast);
                console.error(error);
                return null;
            });
    };





    return { getExamSentence, updateExamSentence, updateExamQuestion, uploadPdf, getModelAnswers, updateModelAnswers, deleteQuestion, getQuestionsForEdit, deletePdf };
}