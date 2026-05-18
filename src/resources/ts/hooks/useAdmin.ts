import axios from "axios";
import { axiosInstance } from "./axiosInstance";
import { useChakraToast } from "../utils/toastUtils";
import { Answer, ErrorResponse, ModelAnswer } from "../types/form";
import { useMutation } from "@tanstack/react-query";
import { QuestionForEdit, UpdateQuestionInputs } from "../types/exam";

export type ExamSentenceResponse = {
    sentence: string;
    purpose: string;
    reviewComment: string;
};

export const useAdmin = () => {
    const { showServerErrorToast, showSuccessToast } = useChakraToast();

    // examSentenceを取得
    const getExamSentence = async (
        year: number,
        season: string,
        section: number,
    ): Promise<ExamSentenceResponse | null> => {
        try {
            const response = await axiosInstance.get<ExamSentenceResponse>(
                `/api/admin/sentence/${year}-${season}-${section}`,
            );

            return response.data;
        } catch (error) {
            console.error("examSentenceの取得に失敗しました", error);
            if (axios.isAxiosError(error) && error.response) {
                // サーバーからのエラーメッセージを表示
                showServerErrorToast("examSentenceの取得に失敗しました");
                console.error("axiosエラー:", error.response.data);
                return null;
            } else {
                showServerErrorToast("examSentenceの取得に失敗しました");
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
        sentence: string | null,
        purpose: string | null,
        reviewComment: string | null,
    ): Promise<void> => {
        // setIsLoading(true);
        try {
            const response = await axiosInstance.put("/api/admin/sentence", {
                year,
                season,
                section,
                sentence,
                purpose,
                reviewComment,
            });
            if (response.status === 200) {
                showSuccessToast("examSentenceを更新しました");
            }
        } catch (error) {
            console.error("問題文の更新に失敗しました", error);
            if (axios.isAxiosError(error) && error.response) {
                // サーバーからのエラーメッセージを表示
                showServerErrorToast("問題文の更新に失敗しました");
                console.error("axiosエラー:", error.response.data);
            } else {
                showServerErrorToast("問題文の更新に失敗しました");
                console.error(error);
            }
        }
    };

    const updateExamQuestion = async (data: UpdateQuestionInputs) => {
        return await axiosInstance
            .post<ErrorResponse | string | null>("/api/admin/question", data)
            .then((response) => {
                if (response.status !== 201) {
                    console.log(response.status);
                    showServerErrorToast("問題の更新に失敗しました");
                    return null;
                }
                return response;
            })
            .catch((error) => {
                if (error.status === 422) {
                    // バリデーションエラー
                    return error;
                } else {
                    showServerErrorToast("問題の更新に失敗しました");
                    return null;
                }
            });
    };

    const uploadPdf = async (
        year: number,
        season: string,
        section: number,
        file: File,
    ): Promise<void> => {
        try {
            if (!file || file.type !== "application/pdf") {
                showServerErrorToast("PDFファイルを選択してください");
                return;
            }

            const formData = new FormData();
            formData.append("year", String(year));
            formData.append("season", season);
            formData.append("section", String(section));
            formData.append("file", file);

            const response = await axiosInstance.post(
                "/api/admin/upload-pdf",
                formData,
            );

            if (response.status === 201) {
                showSuccessToast("PDFが正常にアップロードされました");
            } else {
                showServerErrorToast("PDFのアップロードに失敗しました");
            }
        } catch (error) {
            console.error("PDFのアップロードに失敗しました", error);
            showServerErrorToast("PDFのアップロードに失敗しました");
        }
    };

    const deletePdf = async (year: number, season: string, section: number) => {
        try {
            const response = await axiosInstance.delete(
                `/api/admin/delete-pdf/${year}-${season}-${section}`,
            );

            if (response.status !== 200) {
                showServerErrorToast("PDFの削除に失敗しました");
            }
        } catch (error) {
            console.error("PDFの削除に失敗しました", error);
            showServerErrorToast("PDFの削除に失敗しました");
        }
    };

    const getModelAnswers = async (
        examCode: string,
    ): Promise<ModelAnswer[] | null> => {
        return await axiosInstance
            .get<ModelAnswer[] | null>(`/api/admin/model-answers/${examCode}`)
            .then((response) => {
                if (response.status === 200) {
                    return response.data;
                }
                console.log(response);
                return null;
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    showServerErrorToast("模範解答が見つかりません");
                    return null;
                }

                if (error.response && error.response.status === 401) {
                    // 再ログインの処理が他で走る
                    return null;
                }

                showServerErrorToast("模範解答の取得に失敗しました");
                console.error(error);
                return null;
            });
    };

    type UpdateModelAnswerParams = {
        modelAnswers: { answers: Answer[] };
        examCode: string;
    };

    const updateModelAnswers = useMutation<
        void,
        Error,
        UpdateModelAnswerParams
    >({
        mutationFn: async ({ examCode, modelAnswers }) => {
            await axiosInstance.post(`/api/admin/model-answers/${examCode}`, {
                modelAnswers,
            });
        },
        onSuccess: () => {
            showServerErrorToast("模範解答を更新しました");
        },
        onError: () => showServerErrorToast("模範解答の更新に失敗しました"),
    });

    type DeleteQuestionIdParams = {
        questionCode: string;
        examCode: string;
    };

    const deleteQuestion = useMutation<void, Error, DeleteQuestionIdParams>({
        mutationFn: async ({ examCode, questionCode }) => {
            await axiosInstance.delete(
                `/api/admin/question/${examCode}/${questionCode}`,
            );
        },
        onSuccess: () => {
            showSuccessToast("問題を削除しました");
        },
        onError: () => showServerErrorToast("問題の削除に失敗しました"),
    });

    const getQuestionsForEdit = async (
        examCode: string,
    ): Promise<QuestionForEdit[] | null> => {
        return await axiosInstance
            .get(`/api/admin/questions/${examCode}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    showServerErrorToast("設問が見つかりません");
                    return null;
                }

                showServerErrorToast("設問の取得に失敗しました");
                console.error(error);
                return null;
            });
    };

    return {
        getExamSentence,
        updateExamSentence,
        updateExamQuestion,
        uploadPdf,
        getModelAnswers,
        updateModelAnswers,
        deleteQuestion,
        getQuestionsForEdit,
        deletePdf,
    };
};
