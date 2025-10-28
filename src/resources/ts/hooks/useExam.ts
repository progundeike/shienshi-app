import { useAtom } from "jotai";

import { axiosInstance } from "./axiosInstance";
import { useChakraToast } from "../utils/toastUtils";

export type FetchedQuestion = {
    year: number;
    season: string;
    section: number;
    questionNumber: number;
    subQuestionNumber: number;
    smallQuestionNumber: number;
    type: "radio" | "checkbox" | "input" | "textarea";
    text: string;
    options: Option[] | null; // JSON文字列
    maxLength: number | null
};

export type QuestionForEdit = {
    year: number;
    season: string;
    section: number;
    questionNumber: number;
    subQuestionNumber: number;
    smallQuestionNumber: number;
    type: "radio" | "checkbox" | "input" | "textarea";
    text: string;
    textForAi: string | null;
    options: Option[] | null; // JSON文字列
    maxLength: number | null
};

export type Option = {
    label: string;
    value: string;
}

export type SubmittedExam = {
    year: number;
    season: string;
    section: number;
    season_japanese: string;
    section_converted: string;
}

export type UpdateQuestionInputs = {
        year: number;
        season: string;
        section: number;
        questionNumber: number;
        subQuestionNumber: number;
        smallQuestionNumber: number | null;
        type: "radio" | "checkbox" | "input" | "textarea";
        text: string;
        textForAi: string | null;
        options: Option[] | null; // JSON文字列
        maxLength: number | null;
    };

export const useExam = () => {
    const { unexpectedServerErrorToast, toast } = useChakraToast();

    // const fetchExamList = async () => {
    //     setIsLoading(true);
    //     return await axiosInstance
    //         .get('api/exam-list')
    //         .then((response) => {
    //             if (response.status == 200) {
    //                 return response.data;
    //             }
    //         })
    //         .catch((error) => {
    //             toast(unexpectedServerErrorToast);
    //             return null;
    //         })
    //         .finally(() =>
    //          setIsLoading(false));
    //     }

    const fetchQuestions = async (
        year: number,
        season: string,
        section: number
    ): Promise<FetchedQuestion[] | null> => {
        return await axiosInstance
            .get(`/api/questions/${year}-${season}-${section}`)
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
                return null;
            })
    };

    // 提出済みの試験一覧を取得
    const fetchSubmittedExams = async (): Promise<SubmittedExam[] | null> => {
        return await axiosInstance
            .get("/api/user/submittedExams")
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                toast(unexpectedServerErrorToast);
                console.error(error);
                return null;
            })
    }

    const checkPdfExists = async (
        year: number,
        season: string,
        section: number
    ) => {
        return await axiosInstance
            .get(`/api/exam/${year}-${season}-${section}`)
            .then((response) => {
                if (response.status === 200) {
                    return true;
                }

                return null;
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    return false;
                }

                toast(unexpectedServerErrorToast);
                console.error(error);
                return null;
            });
    }

    

    return { fetchQuestions, fetchSubmittedExams, checkPdfExists };
};
