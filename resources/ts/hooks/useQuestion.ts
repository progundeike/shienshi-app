import { axiosInstance } from "./axiosInstance";

import { AnswerInputs } from "../components/organisms/QuestionAndAnswerForm";
import { useChakraToast } from "../utils/toastUtils";
import { Dialogue, ErrorResponse } from "../types/form";

export const useQuestion = () => {
    const { unexpectedServerErrorToast, toast } = useChakraToast();

    const submitQuestion = async (
        year: number,
        season: string,
        section: number,
        questionNumber: number,
        subQuestionNumber: number,
        message: string,
    ): Promise<string> => {

        try {
            const response = await axiosInstance
            .post<ErrorResponse | string | null>("/api/question", {
                year: year,
                season: season,
                section: section,
                questionNumber: questionNumber,
                subQuestionNumber: subQuestionNumber,
                message: message,
            })

            console.log(response);

            // 成功
            if (response.status === 200 && typeof response.data === "string") {
                return response.data;
            }
            // 失敗
            return '';
        } catch (error) {
            console.log(error);
            // 予期しないサーバーエラー
            toast(unexpectedServerErrorToast);
            return '';
        }
    };

    const fetchDialogues = async (
        year: number,
        season: string,
        section: number,
        questionNumber: number,
        subQuestionNumber: number) => {
        try {
            const response = await axiosInstance
            .get<Dialogue[]>("/api/dialogues", {
                params: 
                    {
                    year: year,
                    season: season,
                    section: section,
                    questionNumber: questionNumber,
                    subQuestionNumber: subQuestionNumber,
                }
            })

            // 成功
            if (response.status === 200) {
                return response.data;
            }

            // 失敗
            return '';
        } catch (error) {
            console.log(error);
            toast(unexpectedServerErrorToast);
            return [];
        }
    }

    const deleteDialogues = async (
        year: number,
        season: string,
        section: number,
        questionNumber: number,
        subQuestionNumber: number) => {
        console.log("start deleteQuestion");
        try {
            const response = await axiosInstance
            .delete<Dialogue[]>(`/api/dialogues/${year}-${season}-${section}-${questionNumber}-${subQuestionNumber}`)

            console.log(response);
        } catch (error) {
            console.log(error);
            toast(unexpectedServerErrorToast);
        }
    }

    return { submitQuestion, fetchDialogues, deleteDialogues };
};
