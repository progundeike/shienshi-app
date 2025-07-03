import axios from "axios";
import { atom, useAtom } from "jotai";

import { axiosInstance } from "./axiosInstance";
import { useChakraToast } from "../utils/toastUtils";
import { UpdateQuestionInputs } from "./useExam";
import { ErrorResponse } from "../types/form";

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
                if (response.status === 201) {
                    toast({
                            title: "問題の更新に成功しました",
                            status: "success",
                            duration: 6000,
                            isClosable: true,
                            position: "bottom-right",
                        });
                        return response.data;
                } else {
                    console.log(response);
                    toast({
                        title: "問題の更新に失敗しました",
                        description: "サーバーからの応答が不正です",
                        status: "error",
                        duration: 6000,
                        isClosable: true,
                        position: "bottom-right",
                    });
                    return null;
                }
            })
            .catch((error) => {
                console.error(error);
                toast(unexpectedServerErrorToast);
                return null;
            })
    };

    const uploadPDF = async (
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

            const response = await axiosInstance.post(
                "/api/admin/upload-pdf",
                {year, season, section, file},
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
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

    return { getExamSentence, updateExamSentence, updateExamQuestion, uploadPDF };
}