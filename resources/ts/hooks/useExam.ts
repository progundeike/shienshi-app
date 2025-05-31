import { useAtom } from "jotai";

import {
    ErrorResponse,
} from "../types/form";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
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
        options: Option[] | null; // JSON文字列
        maxLength: number | null;
    };

export const useExam = () => {
    const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const { unexpectedServerErrorToast, toast } = useChakraToast();

    const fetchQuestions = async (
        year: number,
        season: string,
        section: number
    ): Promise<FetchedQuestion[] | null> => {
        setIsLoading(true);
        return await axiosInstance
            .get(`/api/questions/${year}-${season}-${section}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                toast(unexpectedServerErrorToast);
                return null;
            })
            .finally(() => {
                setIsLoading(false);
            });
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
                } else if(response.status === 404) {
                    return false;
                }

                return null;
            })
            .catch((error) => {
                toast(unexpectedServerErrorToast);
                console.error(error);
                return null;
            });
    }

    const updateExamQuestion = async (
        data: UpdateQuestionInputs
    ) => {
        console.log(data);
        // setIsLoading(true);
        // return await axiosInstance
        //     .post<ErrorResponse | string | null>("/api/question", data)
        //     .then((response) => {
        //         if (response.status === 200) {
        //             if (typeof response.data === "string") {
        //                 toast({
        //                     title: "問題の更新に成功しました",
        //                     description: response.data,
        //                     status: "success",
        //                     duration: 6000,
        //                     isClosable: true,
        //                     position: "bottom-right",
        //                 });
        //                 return response.data;
        //             } else {
        //                 toast({
        //                     title: "問題の更新に失敗しました",
        //                     description: "サーバーからの応答が不正です",
        //                     status: "error",
        //                     duration: 6000,
        //                     isClosable: true,
        //                     position: "bottom-right",
        //                 });
        //                 return null;
        //             }
        //         } else {
        //             toast({
        //                 title: "問題の更新に失敗しました",
        //                 description: "サーバーからの応答が不正です",
        //                 status: "error",
        //                 duration: 6000,
        //                 isClosable: true,
        //                 position: "bottom-right",
        //             });
        //             return null;
        //         }
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //         toast(unexpectedServerErrorToast);
        //         return null;
        //     })
        //     .finally(() => {
        //         setIsLoading(false);
        //     });
    };

    return { fetchQuestions, fetchSubmittedExams, checkPdfExists, updateExamQuestion };
};
