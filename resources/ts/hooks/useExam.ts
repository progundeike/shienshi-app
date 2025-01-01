import { useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";

import {
    ErrorResponse,
} from "../types/form";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";

export type FetchedQuestion = {
    year: number;
    season: string;
    section: number;
    questionNumber: number;
    subQuestionNumber: number;
    smallQuestionNumber: number;
    type: string;
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

export const useExam = () => {
    const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const toast = useToast();

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
                // その他のエラー
                toast({
                    title: "サーバーエラー",
                    description:
                        "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
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
                // その他のエラー
                toast({
                    title: "サーバーエラー",
                    description:
                        "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
                return null;
            })
    }

    const checkPdfExists = async (
        year: string,
        season: string,
        section: string
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
                console.error(error);
                return null;
            });
    }

    return { fetchQuestions, fetchSubmittedExams, checkPdfExists };
};
